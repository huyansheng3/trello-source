import React, { useState, useRef, useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { Button } from '@trello/nachos/button';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Textfield } from '@trello/nachos/textfield';

import { calculatePos } from '@trello/arrays';
import { forTemplate } from '@trello/i18n';
import Alerts from 'app/scripts/views/lib/alerts';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { ViewDropdown } from 'app/src/components/ViewsGenerics/ViewDropdown';

import { useCreateListMutation } from './CreateListMutation.generated';
import styles from './ViewsAddListPopover.less';
import { ViewsAddListPopoverProps } from './types';

const format = forTemplate('views');

function ViewsAddListPopover({
  idBoard,
  isVisible,
  onHide,
  feature,
  popoverTargetRef,
  onListCreated,
  lists,
}: ViewsAddListPopoverProps) {
  const { popoverProps } = usePopover<HTMLElement, HTMLDivElement>();
  const [title, setTitle] = useState<string>('');
  const maxPosition = lists.length + 1;
  const [selectedPosition, setSelectedPosition] = useState<number>(
    maxPosition - 1,
  );
  const [createList] = useCreateListMutation();

  const dropdownOptions = Array.from({ length: maxPosition }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i}`,
    isSelected: i === selectedPosition,
  }));

  const validateForm = () => title.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onHide();
    if (validateForm()) {
      const source =
        feature === Feature.TimelineView
          ? 'timelineViewScreen'
          : 'calendarViewScreen';
      const taskName =
        feature === Feature.TimelineView
          ? 'create-list/timeline'
          : 'create-list/calendar';

      const traceId = Analytics.startTask({
        taskName,
        source,
      });
      try {
        const position = calculatePos(
          selectedPosition,
          lists.map((list) => ({
            id: list.id,
            pos: list.pos,
          })),
          {
            //fake id since this list is not created yet
            id: 'id',
            pos: selectedPosition,
          },
        );
        const { data } = await createList({
          variables: {
            idBoard,
            name: title,
            pos: (position || -1) - 1,
            traceId,
          },
        });
        if (data && data.createList) {
          const { createList } = data;
          onListCreated({
            id: createList.id,
            pos: createList.pos,
            name: createList.name,
            traceId,
          });
          Analytics.taskSucceeded({
            taskName,
            source,
            traceId,
          });
        }
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-ecosystem',
            feature,
          },
          extraData: {
            component: 'AddList',
          },
        });
        Analytics.taskFailed({
          taskName,
          source,
          traceId,
          error: err,
        });
        Alerts.showLiteralText(
          format('we-could-not-create-your-list'),
          'error',
          'addListAlert',
          3000,
        );
      }
    }
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
        title={format('add-list')}
        onHide={onHide}
        isVisible={isVisible}
        triggerElement={popoverTargetRef.current}
        size="large"
      >
        <form
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={onSubmit}
        >
          <Textfield
            label={format('title')}
            placeholder={format('enter-title-for-list')}
            value={title}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            ref={titleRef}
          />
          <ViewDropdown
            displayText={`${selectedPosition + 1}`}
            options={dropdownOptions}
            // eslint-disable-next-line react/jsx-no-bind
            onChangeOption={(item) => {
              setSelectedPosition(parseInt(item.value, 10));
            }}
            label={format('position')}
            popoverWidth={160}
          />
          <Button
            appearance="primary"
            size="fullwidth"
            type="submit"
            isDisabled={!validateForm()}
            className={styles.submitButton}
          >
            {format('add-list')}
          </Button>
        </form>
      </Popover>
    </ErrorBoundary>
  );
}

export { ViewsAddListPopover };
