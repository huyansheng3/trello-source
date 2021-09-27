import React, { useCallback, useEffect, useState, useRef } from 'react';

import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { OrganizationVisibleIcon } from '@trello/nachos/icons/organization-visible';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Spinner } from '@trello/nachos/spinner';
import { Textfield } from '@trello/nachos/textfield';
import { getKey, Key } from '@trello/keybindings';
import OrganizationViewsQuery from 'app/src/components/WorkspaceNavigation/OrganizationViewsQuery.graphql';

import styles from './CreateWorkspaceViewPopoverScreenContent.less';
import { useCreateOrganizationViewMutation } from './CreateOrganizationViewMutation.generated';
import { navigate } from 'app/scripts/controller/navigate';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { Urls } from 'app/scripts/controller/urls';
const { getWorkspaceViewUrl } = Urls;
import { wait } from '@trello/time';

const format = forTemplate('organization_view');

type ViewType = 'Table' | 'Calendar';

interface ViewChoiceSelectorProps {
  selectedViewType: ViewType;
  setSelectedViewType: (type: ViewType) => void;
}

const ViewChoiceSelector: React.FC<ViewChoiceSelectorProps> = ({
  selectedViewType,
  setSelectedViewType,
}: ViewChoiceSelectorProps) => {
  const srcTableActive = require('resources/images/workspace-views/view-as-table-active.svg');
  const srcTableInactive = require('resources/images/workspace-views/view-as-table-inactive.svg');
  const srcCalendarActive = require('resources/images/workspace-views/view-as-calendar-active.svg');
  const srcCalendarInactive = require('resources/images/workspace-views/view-as-calendar-inactive.svg');

  const onTableOptionClick = useCallback(() => setSelectedViewType('Table'), [
    setSelectedViewType,
  ]);

  const onCalendarOptionClick = useCallback(
    () => setSelectedViewType('Calendar'),
    [setSelectedViewType],
  );

  return (
    <div className={styles.viewAsContainer} role="listbox">
      <div
        className={styles.viewAsOption}
        onClick={onTableOptionClick}
        role="option"
        aria-selected={selectedViewType === 'Table'}
      >
        <div className={styles.viewAsOptionSelectionBox}>
          <img
            src={
              selectedViewType === 'Table' ? srcTableActive : srcTableInactive
            }
            alt={format('table-view-option')}
          />
        </div>
        <span>{format('table')}</span>
      </div>
      <div
        className={styles.viewAsOption}
        onClick={onCalendarOptionClick}
        role="option"
        aria-selected={selectedViewType === 'Calendar'}
      >
        <div className={styles.viewAsOptionSelectionBox}>
          <img
            src={
              selectedViewType === 'Calendar'
                ? srcCalendarActive
                : srcCalendarInactive
            }
            alt={format('calendar-view-option')}
          />
        </div>
        <span>{format('calendar')}</span>
      </div>
    </div>
  );
};

interface CreateWorkspaceViewPopoverScreenContentProps {
  idOrganization?: string;
  name?: string;
  boardsFilter?: string[];
  viewType?: ViewType;

  onClose: () => void;
}

export const CreateWorkspaceViewPopoverScreenContent: React.FC<CreateWorkspaceViewPopoverScreenContentProps> = ({
  idOrganization,
  name,
  boardsFilter,
  viewType,
  onClose,
}: CreateWorkspaceViewPopoverScreenContentProps) => {
  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
  } = usePopover<HTMLButtonElement>();

  const [
    createOrganizationView,
    { data, loading, error },
  ] = useCreateOrganizationViewMutation();

  const [nameText, setNameText] = useState<string>(name ?? '');

  const [visibility, setVisibility] = useState<'private' | 'workspace'>(
    'private',
  );

  const validTitle = nameText !== '';

  const nameElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data && !loading) {
      if (data.createOrganizationView) {
        navigate(getWorkspaceViewUrl(data.createOrganizationView), {
          trigger: true,
        });
      }
      onClose();
    }
  }, [data, loading, onClose]);

  const [selectedViewType, setSelectedViewType] = useState<ViewType>(
    viewType ?? 'Table',
  );

  const sendCreateWorkspaceViewEvent = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'createWorkspaceViewButton',
      source: 'createWorkspaceViewInlineDialog',
      containers: {
        organization: {
          id: idOrganization,
        },
      },
      attributes: {
        viewName: nameText,
        viewType: selectedViewType,
      },
    });
  }, [idOrganization, nameText, selectedViewType]);

  const sendCancelWorkspaceViewEvent = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'cancelWorkspaceViewButton',
      source: 'createWorkspaceViewInlineDialog',
      containers: {
        organization: {
          id: idOrganization,
        },
      },
    });
  }, [idOrganization]);

  const doCreateWorkspaceViewMutation = useCallback(() => {
    if (idOrganization && nameText?.length > 0) {
      sendCreateWorkspaceViewEvent();

      const permissionLevel = visibility === 'private' ? 'private' : 'team';
      createOrganizationView({
        variables: {
          name: nameText,
          idOrganization,
          prefs: { permissionLevel },
          views: [
            {
              cardFilter: boardsFilter && {
                criteria: [{ idBoards: boardsFilter }],
              },
              defaultViewType: selectedViewType,
            },
          ],
        },
        refetchQueries: [
          {
            query: OrganizationViewsQuery,
            variables: {
              orgId: idOrganization,
            },
          },
        ],
      });
    }
  }, [
    idOrganization,
    nameText,
    sendCreateWorkspaceViewEvent,
    visibility,
    createOrganizationView,
    boardsFilter,
    selectedViewType,
  ]);

  useEffect(() => {
    async function waitThenFocus() {
      // Without this wait, the focus call does not focus the input
      // This issue is caused by the timing of React rendering & focus
      // See: https://blog.maisie.ink/react-ref-autofocus/
      await wait(1);
      nameElement?.current?.focus();
    }

    waitThenFocus();
  }, []);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'createWorkspaceViewInlineDialog',
      attributes: {
        preFilledBoardsFilter: boardsFilter ?? null,
      },
      containers: {
        organization: {
          id: idOrganization,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setNameText(e.target.value);
    },
    [],
  );

  const onClickPrivate = useCallback(() => {
    setVisibility('private');
    hide();
  }, [hide]);

  const onClickWorkspaceVisible = useCallback(() => {
    setVisibility('workspace');
    hide();
  }, [hide]);

  const onClickCancel = useCallback(() => {
    sendCancelWorkspaceViewEvent();
    onClose();
  }, [onClose, sendCancelWorkspaceViewEvent]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      switch (getKey(e)) {
        case Key.Enter:
          doCreateWorkspaceViewMutation();
          break;
        default:
          break;
      }
    },
    [doCreateWorkspaceViewMutation],
  );

  const srcTableGraphic = require('resources/images/workspace-views/table-graphic.svg');
  const srcCalendarGraphic = require('resources/images/workspace-views/calendar-graphic.svg');

  return (
    <div
      role={'presentation'}
      className={styles.createWorkspaceViewContent}
      onKeyDown={onKeyDown}
    >
      <div className={styles.viewTypeGraphicContainer}>
        <img
          src={
            selectedViewType === 'Table' ? srcTableGraphic : srcCalendarGraphic
          }
          alt={
            selectedViewType === 'Table' ? format('table') : format('calendar')
          }
        ></img>
      </div>
      <span className={styles.subtitle}>{format('title')}</span>
      <Textfield
        placeholder={format('eg-team-health')}
        ref={nameElement}
        value={nameText}
        onChange={onChangeName}
      ></Textfield>
      <span className={styles.subtitle}>{format('view-as')}</span>
      <ViewChoiceSelector
        selectedViewType={selectedViewType}
        setSelectedViewType={setSelectedViewType}
      />
      <span className={styles.subtitle}>{format('visibility')}</span>
      <Button
        className={styles.visibilityChooserButton}
        shouldFitContainer
        ref={triggerRef}
        onClick={toggle}
      >
        <span className={styles.selectorButtonContent}>
          <span className={styles.selectedOptionIcon}>
            {visibility === 'private' ? (
              <PrivateIcon color="gray" size="small" />
            ) : (
              <OrganizationVisibleIcon color="gray" size="small" />
            )}
          </span>
          <span className={styles.selectorButtonText}>
            {visibility === 'private'
              ? format('private')
              : format('workspace-visible')}
          </span>
          <span className={styles.downIconContainer}>
            <DownIcon color="gray" size="small" />
          </span>
        </span>
      </Button>
      <Popover {...popoverProps}>
        <PopoverMenu>
          <PopoverMenuButton
            onClick={onClickPrivate}
            className={styles.visibilityItemButton}
          >
            <div className={styles.visibilitySelectorItem}>
              <div className={styles.visibilityIconContainer}>
                <PrivateIcon color="gray" size="small" />
              </div>
              <div>
                {format('private')}
                <br />
                <span className={styles.visibilityItemSubtext}>
                  {format('only-you-and-workspace-admins-can-see-and-edit')}
                </span>
              </div>
            </div>
          </PopoverMenuButton>
          <PopoverMenuButton
            onClick={onClickWorkspaceVisible}
            className={styles.visibilityItemButton}
          >
            <div className={styles.visibilitySelectorItem}>
              <div className={styles.visibilityIconContainer}>
                <OrganizationVisibleIcon color="gray" size="small" />
              </div>
              <div>
                {format('workspace-visible')}
                <br />
                <span className={styles.visibilityItemSubtext}>
                  {format('all-workspace-members-can-see-and-edit')}
                </span>
              </div>
            </div>
          </PopoverMenuButton>
        </PopoverMenu>
      </Popover>
      <div className={styles.buttons}>
        {loading ? (
          <Button isDisabled className={styles.submitCancelButton}>
            <Spinner small></Spinner>
          </Button>
        ) : (
          <Button
            appearance={'primary'}
            isDisabled={!validTitle}
            onClick={doCreateWorkspaceViewMutation}
            className={styles.submitCancelButton}
          >
            {format('create')}
          </Button>
        )}

        <Button
          appearance="default"
          onClick={onClickCancel}
          className={styles.submitCancelButton}
        >
          {format('cancel')}
        </Button>
      </div>
      {error && <span>{format('an-error-occurred')}</span>}
    </div>
  );
};
