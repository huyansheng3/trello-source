import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { AddIcon } from '@trello/nachos/icons/add';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { TableIcon } from '@trello/nachos/icons/table';
import { PrivateIcon } from '@trello/nachos/icons/private';
import styles from './CollapsibleViewsList.less';
import { CollapsibleList } from './CollapsibleList';
import { ActionSubjectIdType, Analytics } from '@trello/atlassian-analytics';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { useSeesVersionedVariation } from '@trello/feature-flag-client';
import {
  CreateWorkspaceViewPopoverScreen,
  Screen,
} from 'app/src/components/CreateWorkspaceViewPopoverScreen/CreateWorkspaceViewPopoverScreen';
import { Popover, usePopover, PopoverPlacement } from '@trello/nachos/popover';
import { ViewsListItem, ViewsListItemProps } from './ViewsListItem';
import { Urls } from 'app/scripts/controller/urls';
const { getWorkspaceViewUrl } = Urls;
const { getLocation } = require('@trello/router');
import { useWorkspace } from '@trello/workspaces';

const format = forTemplate('workspace_navigation');

const getIconFromName = (name: string) => {
  let ViewIcon;
  switch (name) {
    case 'calendar':
      ViewIcon = CalendarIcon;
      break;
    case 'table':
    default:
      ViewIcon = TableIcon;
      break;
  }
  return <ViewIcon size="small" />;
};

const getIconFromOrganizationView = (organizationView: WorkspaceViewProps) => {
  let ViewIcon;
  const viewType = organizationView?.views?.[0]?.defaultViewType;
  switch (viewType) {
    case 'Table':
      ViewIcon = TableIcon;
      break;
    case 'Calendar':
      ViewIcon = CalendarIcon;
      break;
    default:
      ViewIcon = TableIcon;
      break;
  }
  return <ViewIcon size="small" />;
};

export interface ViewItem extends Omit<ViewsListItemProps, 'icon'> {
  linkName: ActionSubjectIdType;
  iconName: string;
}

export interface WorkspaceViewProps {
  id: string;
  name: string;
  shortLink: string;
  prefs: {
    permissionLevel: string;
  };
  views: { defaultViewType: string }[];
}

interface ViewsListProps {
  views: ViewItem[];
  idOrganization?: string;
  organizationViews?: WorkspaceViewProps[];
  idEnterprise?: string | null;
  hasViewsFeature: boolean;
}

export const CollapsibleViewsList: React.FunctionComponent<ViewsListProps> = ({
  views,
  idOrganization,
  organizationViews,
  idEnterprise,
  hasViewsFeature,
}) => {
  const workspace = useWorkspace();

  const { pathname } = getLocation();

  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>({
    initialScreen: Screen.CreateWorkspaceViewPopoverScreen,
  });

  const handleCreateViewClick = useCallback(
    function handleCreateViewClick() {
      toggle();

      Analytics.sendClickedLinkEvent({
        linkName: 'createViewLink',
        source: 'currentWorkspaceNavigationDrawer',
        containers: {
          organization: {
            id: idOrganization,
          },
          enterprise: {
            id: idEnterprise,
          },
        },
      });
    },
    [toggle, idOrganization, idEnterprise],
  );

  const handleViewClick = useCallback(
    (linkName: ActionSubjectIdType) => {
      Analytics.sendClickedLinkEvent({
        linkName,
        source: 'currentWorkspaceNavigationDrawer',
        containers: {
          organization: {
            id: idOrganization,
          },
          enterprise: {
            id: idEnterprise,
          },
        },
      });
    },
    [idOrganization, idEnterprise],
  );

  const handleOrganizationViewClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'organizationViewLink',
      source: 'currentWorkspaceNavigationDrawer',
      containers: {
        organization: {
          id: idOrganization,
        },
      },
    });
  }, [idOrganization]);

  const isOrganizationViewsEnabled = useSeesVersionedVariation(
    'remarkable.saved-workspace-views',
    'alpha',
  );

  return (
    <>
      {
        <CollapsibleList
          title={format('team-views')}
          data-test-id={WorkspaceNavigationTestIds.ViewsList}
          controls={
            isOrganizationViewsEnabled &&
            hasViewsFeature && (
              <>
                <Button
                  iconBefore={<AddIcon size="small" color="quiet" />}
                  onClick={handleCreateViewClick}
                  aria-label={format('create-a-view')}
                  className={styles.iconButton}
                  ref={triggerRef}
                  data-test-id={
                    WorkspaceNavigationTestIds.CreateWorkspaceViewButton
                  }
                />
                <Popover
                  {...popoverProps}
                  placement={PopoverPlacement.RIGHT_START}
                >
                  <CreateWorkspaceViewPopoverScreen
                    onClose={toggle}
                    idOrganization={idOrganization}
                  />
                </Popover>
              </>
            )
          }
        >
          {views.map((view) => (
            <ViewsListItem
              key={view.href}
              icon={getIconFromName(view.iconName)}
              href={view.href}
              isBeta={view.isBeta}
              title={view.title}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => handleViewClick(view.linkName)}
              secondaryIcon={
                view.prefs?.permissionLevel === 'private' && (
                  <PrivateIcon size="small" />
                )
              }
              active={pathname === view.href}
            />
          ))}
          {isOrganizationViewsEnabled && hasViewsFeature && (
            <>
              {organizationViews?.map((view) => (
                <ViewsListItem
                  key={view.shortLink}
                  icon={getIconFromOrganizationView(view)}
                  secondaryIcon={
                    view.prefs.permissionLevel === 'private' && (
                      <PrivateIcon size="small" />
                    )
                  }
                  onClick={handleOrganizationViewClick}
                  title={view.name}
                  href={getWorkspaceViewUrl(view)}
                  id={view.id}
                  active={workspace.idWorkspaceView === view.id}
                />
              ))}
            </>
          )}
        </CollapsibleList>
      }
    </>
  );
};
