/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useEffect } from 'react';

import {
  CardLabel,
  LabelColor,
  labelColorToColorBlindPattern,
} from '@atlassian/trello-canonical-components/src/card-front/CardLabel';

import { Analytics } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';

import { Button } from '@trello/nachos/button';
import { CheckIcon } from '@trello/nachos/icons/check';
import { Popover, PopoverPlacement, usePopover } from '@trello/nachos/popover';
import { Textfield } from '@trello/nachos/textfield';

import { forTemplate } from '@trello/i18n';
import Alerts from 'app/scripts/views/lib/alerts';

import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { ViewDropdown } from 'app/src/components/ViewsGenerics/ViewDropdown';
import { Label, DropdownOption } from 'app/src/components/ViewsGenerics/types';

import { DateField } from 'app/src/components/ViewsGenerics/DateField';

import { DateType, ViewsAddCardPopoverProps } from './types';

import { useViewsAddCardPopover } from './useViewsAddCardPopover';

import {
  useCreateCardMutation,
  CreateCardMutationVariables,
} from './CreateCardMutation.generated';
import styles from './ViewsAddCardPopover.less';

const format = forTemplate('views');

const POPOVER_SIZE_LARGE = 360;

export const LabelOption = ({
  option,
  labels,
  colorBlind,
}: {
  option: DropdownOption;
  labels: Array<Label>;
  colorBlind: boolean;
}) => {
  const label = labels?.find((label) => label.id === option.value);
  if (!label) {
    return null;
  }
  const color = (label.color || 'gray') as LabelColor;
  return (
    <CardLabel
      key={label.id}
      color={color}
      pattern={colorBlind ? labelColorToColorBlindPattern[color] : null}
      className={styles.label}
    >
      <span className={styles.labelText}>{option.label}</span>
      {option.isSelected && (
        <CheckIcon
          size="small"
          color="light"
          dangerous_className={styles.labelCheck}
        />
      )}
    </CardLabel>
  );
};

export const MemberOption = ({ option }: { option: DropdownOption }) => (
  <div className={styles.memberWrapper}>
    <MemberAvatar idMember={option.value} className={styles.memberAvatar} />
    <div className={styles.memberText}>{option.label}</div>
    {option.isSelected && (
      <CheckIcon size="small" dangerous_className={styles.labelCheck} />
    )}
  </div>
);

function ViewsAddCardPopover({
  onHide,
  isVisible,
  popoverTargetRef,
  startTime,
  dueTime,
  lists,
  selectedListId,
  labels = [],
  selectedLabelId,
  members = [],
  selectedMemberId,
  addCardSubmit,
  colorBlind = false,
  feature,
}: ViewsAddCardPopoverProps) {
  const { popoverProps } = usePopover<HTMLElement, HTMLDivElement>();
  const [createCard] = useCreateCardMutation();

  const { state, dispatch } = useViewsAddCardPopover({
    startTime,
    dueTime,
    lists,
    selectedListId,
    labels,
    selectedLabelId,
    members,
    selectedMemberId,
  });

  const onDateChange = (type: DateType, value: number) => {
    const action =
      type === DateType.START ? 'start_date_updated' : 'due_date_updated';
    dispatch({ type: action, payload: { time: value } });
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onHide();
    if (validateForm()) {
      const idList = state.listOptions.find((list) => list.isSelected)?.value;
      const source =
        feature === Feature.TimelineView
          ? 'timelineViewScreen'
          : 'calendarViewScreen';
      const taskName =
        feature === Feature.TimelineView
          ? 'create-card/timeline'
          : 'create-card/calendar';

      const traceId = Analytics.startTask({
        taskName,
        source,
      });

      const data = {
        idList,
        name: state.title.trim().replace(/\s\s+/g, ' '),
        closed: false,
        idLabels: (
          state.labelOptions.filter((label) => label.isSelected) || []
        ).map((label) => label.value),
        idMembers: (
          state.memberOptions.filter((label) => label.isSelected) || []
        ).map((label) => label.value),
        ...(state.startTime && { start: `${state.startTime}` }),
        ...(state.dueTime && { due: `${state.dueTime}` }),
        traceId,
      };
      if (idList) {
        try {
          const result = await createCard({
            variables: data as CreateCardMutationVariables,
          });
          const idCard = result?.data?.createCard?.id;
          addCardSubmit({
            start: state.startTime,
            due: state.dueTime,
            idLabels: data.idLabels,
            idMembers: data.idMembers,
            idList: data.idList,
            idCard,
            traceId,
          });
          Analytics.taskSucceeded({
            taskName,
            source,
            traceId,
          });
        } catch (err) {
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-ecosystem',
              feature,
            },
            extraData: {
              component: 'AddCard',
            },
          });
          Analytics.taskFailed({
            taskName,
            source,
            traceId,
            error: err,
          });
          Alerts.showLiteralText(
            format('we-could-not-create-your-card'),
            'error',
            'addCardAlert',
            3000,
          );
        }
      }
    }
  };

  const validateForm = () => {
    return (
      state.title.trim().length > 0 &&
      state.listOptions.filter((list) => list.isSelected).length > 0
    );
  };

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This is a workaround to allow `Textfield` to be painted
    // so that it can be focused.
    setTimeout(() => titleRef.current?.focus(), 10);
  }, []);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-ecosystem',
        feature,
      }}
    >
      <Popover
        {...popoverProps}
        title={format('add-card')}
        onHide={onHide}
        isVisible={isVisible}
        triggerElement={popoverTargetRef.current}
        placement={PopoverPlacement.TOP_START}
        size="large"
      >
        <form
          className={styles.popoverForm}
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={onFormSubmit}
        >
          <Textfield
            label={format('title')}
            placeholder={format('enter-title-for-card')}
            value={state.title}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e) => {
              dispatch({
                type: 'title_updated',
                payload: { title: e.target.value },
              });
            }}
            ref={titleRef}
          />
          {/* Lists */}
          <ViewDropdown
            displayText={
              state.listDisplayText || format('select-list-for-card')
            }
            options={state.listOptions}
            // eslint-disable-next-line react/jsx-no-bind
            onChangeOption={(item) =>
              dispatch({ type: 'list_selected', payload: { item } })
            }
            overrideStyles={
              {
                ...styles,
                ...(state.listDisplayText === ''
                  ? {
                      dropdownButton: [styles.dropdownButtonPlaceholder],
                    }
                  : {}),
              } as CSSModule
            }
            label={format('list')}
            popoverWidth={POPOVER_SIZE_LARGE}
            dropdownPlacement={
              state.listOptions.length > 3
                ? PopoverPlacement.RIGHT_END
                : PopoverPlacement.BOTTOM
            }
          />
          {/* Labels */}
          {labels.length > 0 && (
            <ViewDropdown
              displayText={
                state.labelDisplayText || format('select-labels-for-card')
              }
              options={state.labelOptions}
              // eslint-disable-next-line react/jsx-no-bind
              onChangeOption={(item) =>
                dispatch({ type: 'label_selected', payload: { item } })
              }
              overrideStyles={
                {
                  ...styles,
                  ...(state.labelDisplayText === ''
                    ? {
                        dropdownButton: [styles.dropdownButtonPlaceholder],
                      }
                    : {}),
                } as CSSModule
              }
              label={format('label')}
              optionsLabel={format('labels')}
              popoverWidth={POPOVER_SIZE_LARGE}
              // eslint-disable-next-line react/jsx-no-bind
              optionRenderer={(option) => (
                <LabelOption
                  option={option}
                  labels={labels}
                  colorBlind={colorBlind}
                />
              )}
              dropdownPlacement={
                state.labelOptions.length > 2
                  ? PopoverPlacement.RIGHT_END
                  : PopoverPlacement.BOTTOM
              }
              isMultiselect
            />
          )}
          {/* Members */}
          {/* TODO: This needs a search component, update during integration */}
          {members.length > 0 && (
            <ViewDropdown
              displayText={
                state.memberDisplayText || format('select-members-for-card')
              }
              options={state.memberOptions}
              // eslint-disable-next-line react/jsx-no-bind
              onChangeOption={(item) =>
                dispatch({ type: 'member_selected', payload: { item } })
              }
              overrideStyles={
                {
                  ...styles,
                  ...(state.memberDisplayText === ''
                    ? {
                        dropdownButton: [styles.dropdownButtonPlaceholder],
                      }
                    : {}),
                } as CSSModule
              }
              label={format('member')}
              optionsLabel={format('members')}
              popoverWidth={POPOVER_SIZE_LARGE}
              // eslint-disable-next-line react/jsx-no-bind
              optionRenderer={(option) => <MemberOption option={option} />}
              dropdownPlacement={
                state.memberOptions.length > 2
                  ? PopoverPlacement.RIGHT_END
                  : PopoverPlacement.BOTTOM
              }
              searchPlaceholder={format('search-members')}
              isMultiselect
              showSearch
            />
          )}
          <div className={styles.dateWrapper}>
            <DateField
              enabled={state.startEnabled}
              // eslint-disable-next-line react/jsx-no-bind
              onToggle={() => dispatch({ type: 'toggle_start' })}
              label={format('start-date')}
              timestamp={state.startTime}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(value) => onDateChange(DateType.START, value)}
            />
            <DateField
              enabled={state.dueEnabled}
              // eslint-disable-next-line react/jsx-no-bind
              onToggle={() => dispatch({ type: 'toggle_due' })}
              label={format('due-date')}
              timestamp={state.dueTime}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(value) => onDateChange(DateType.DUE, value)}
              showTime
            />
          </div>
          <Button
            appearance="primary"
            size="fullwidth"
            type="submit"
            className={styles.submitButton}
            isDisabled={!validateForm()}
          >
            {format('add-card')}
          </Button>
        </form>
      </Popover>
    </ErrorBoundary>
  );
}

export { ViewsAddCardPopover };
