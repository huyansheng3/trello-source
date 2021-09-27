import React, { useCallback, useContext, useMemo } from 'react';
import cx from 'classnames';

import { NudgeTooltipPulse } from '@atlassiansox/nudge-tooltip';
import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';
// eslint-disable-next-line no-restricted-imports
import { CheckItem_State } from '@trello/graphql/generated';
import { Checkbox } from '@trello/nachos/checkbox';
import { truncate } from '@trello/strings';
import { CalendarViewTestIds } from '@trello/test-ids';

import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';
import { Facepile } from 'app/src/components/Facepile';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import {
  TrelloMarkdown,
  MarkdownContentType,
} from 'app/src/components/TrelloMarkdown';
import { useUpdateCheckItemStateMutation } from 'app/src/components/ViewsGenerics/UpdateCheckItemStateMutation.generated';

import { AddPopoverContext } from 'app/src/components/BoardCalendarView/AddPopoverContext';
import { EventData } from 'app/src/components/BoardCalendarView/types';
import { CalendarContext } from 'app/src/components/BoardCalendarView/CalendarContext';

import { AnimatedLabels } from './AnimatedLabels';
import { BoardBackgroundPreview } from './BoardBackgroundPreview';

import styles from './CalendarEvent.less';

const CALENDAR_CARD_MEMBER_SIZE = 28;
const CALENDAR_CHECKITEM_MEMBER_SIZE = 22;

interface CalendarEventProps {
  event: EventData;
  itemClassName?: string;
  preventChecklistInfo?: boolean;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  event,
  itemClassName,
  preventChecklistInfo,
}) => {
  const [updateCheckItemState] = useUpdateCheckItemStateMutation();

  const { canEditBoard, contextType, getLinkToCardProps } = useContext(
    BoardViewContext,
  );
  const isWorkspaceView = contextType === 'workspace';

  const { cardToHighlight } = useContext(AddPopoverContext);

  const { colorBlind, expandedLabels } = useContext(CalendarContext);

  const { data, isChecklistItem, title } = event;

  const {
    membersAssigned,
    complete,
    id,
    idBoard,
    idCard,
    idEnterprise,
    idOrganization,
    labels = [],
    checklistInfo,
    boardInfo,
    cardUrl,
  } = data;

  const changeCheckItemState = useCallback(async () => {
    const {
      complete,
      id,
      idBoard,
      idCard,
      idChecklist,
      idEnterprise,
      idOrganization,
    } = data;

    if (!canEditBoard(idBoard)) {
      return;
    }

    if (isChecklistItem) {
      Analytics.sendUIEvent({
        action: complete ? 'unchecked' : 'completed',
        actionSubject: 'checkbox',
        actionSubjectId: 'calendarCheckItem',
        source: 'calendarViewScreen',
        containers: {
          board: { id: idBoard || null },
          organization: { id: idOrganization || null },
          enterprise: { id: idEnterprise || null },
        },
        attributes: { contextType },
      });

      const traceId = Analytics.startTask({
        taskName: 'edit-checkItem/state',
        source: 'calendarViewScreen',
      });

      const state = complete
        ? CheckItem_State.Incomplete
        : CheckItem_State.Complete;
      try {
        await updateCheckItemState({
          variables: {
            cardId: idCard as string,
            checklistId: idChecklist as string,
            checkItemId: id,
            state,
            traceId: traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCheckItemState: {
              id,
              state,
              __typename: 'CheckItem',
            },
          },
        });

        Analytics.sendTrackEvent({
          source: 'calendarViewScreen',
          action: 'updated',
          actionSubject: 'checkItem',
          actionSubjectId: 'state',
          attributes: {
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-checkItem/state',
          traceId,
          source: 'calendarViewScreen',
        });
      } catch (error) {
        throw Analytics.taskFailed({
          taskName: 'edit-checkItem/state',
          traceId,
          source: 'calendarViewScreen',
          error,
        });
      }
    }
  }, [data, canEditBoard, isChecklistItem, contextType, updateCheckItemState]);

  const showFacepile = membersAssigned && membersAssigned.length > 0;

  const idMembers = membersAssigned.map((member) => member.id);

  const trackCardClick = useCallback(() => {
    const analyticsInfo = {
      containers: {
        board: { id: idBoard || null },
        organization: { id: idOrganization || null },
        enterprise: { id: idEnterprise || null },
      },
      attributes: { contextType },
    };
    if (isChecklistItem) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'calendarCheckItemButton',
        source: 'calendarViewScreen',
        ...analyticsInfo,
      });
    } else {
      Analytics.sendClickedButtonEvent({
        buttonName: 'calendarCardButton',
        source: 'calendarViewScreen',
        ...analyticsInfo,
      });
    }
  }, [idBoard, idEnterprise, idOrganization, isChecklistItem, contextType]);

  const linkProps = useMemo(
    () =>
      getLinkToCardProps({
        idCard: isChecklistItem ? idCard : id,
        cardUrl,
        onClick: trackCardClick,
      }),
    [getLinkToCardProps, cardUrl, trackCardClick, isChecklistItem, idCard, id],
  );

  const isNudgeEnabled = useFeatureFlag(
    'ecosystem.views-add-card-nudge',
    false,
  );

  const AVATAR_SIZE = isChecklistItem
    ? CALENDAR_CHECKITEM_MEMBER_SIZE
    : CALENDAR_CARD_MEMBER_SIZE;

  const renderAvatar = useCallback(
    (idMember) => {
      const memberData = membersAssigned.find(
        (member) => member.id === idMember,
      );
      return (
        <MemberAvatar
          size={AVATAR_SIZE}
          idMember={idMember}
          memberData={memberData}
        />
      );
    },
    [AVATAR_SIZE, membersAssigned],
  );

  const showChecklistInfo = isChecklistItem && !preventChecklistInfo;

  const content = (
    <div
      className={cx(
        styles.calendarEvent,
        !isChecklistItem && styles.cardContainer,
      )}
    >
      {isChecklistItem && (
        <Checkbox
          className={cx(
            styles.checkbox,
            !canEditBoard(idBoard) && styles.disabled,
          )}
          testId={CalendarViewTestIds.ACItemCheckbox}
          isChecked={complete}
          onChange={changeCheckItemState}
        />
      )}
      {isWorkspaceView && !isChecklistItem && boardInfo && (
        <BoardBackgroundPreview
          name={boardInfo.name}
          url={boardInfo.url}
          backgroundColor={boardInfo.backgroundColor}
          backgroundImageScaled={boardInfo.backgroundImageScaled}
          backgroundImage={boardInfo.backgroundImage}
          backgroundTile={boardInfo.backgroundTile}
        />
      )}
      <RouterLink
        className={cx(
          isChecklistItem ? styles.checklistItem : styles.card,
          itemClassName,
          preventChecklistInfo && styles.reducedMinHeight,
        )}
        testId={CalendarViewTestIds.CalendarEvent}
        {...linkProps}
      >
        <div className={styles.leftContent}>
          {labels && labels.length > 0 && (
            <AnimatedLabels
              labels={labels}
              colorBlind={colorBlind}
              expandedLabels={expandedLabels}
            />
          )}
          <div
            className={cx(
              styles.text,
              (!labels || labels.length === 0) && styles.allowTextWrap,
              showChecklistInfo && styles.limitOneLine,
              isChecklistItem && complete && styles.textCompleted,
            )}
          >
            {isChecklistItem ? (
              <TrelloMarkdown
                text={title}
                contentType={MarkdownContentType.CheckItems}
              />
            ) : (
              truncate(title, 60)
            )}
          </div>
          {showChecklistInfo && checklistInfo && checklistInfo.cardName && (
            <div className={styles.cardLink}>{checklistInfo.cardName}</div>
          )}
        </div>
        {showFacepile && (
          <Facepile
            className={styles.facepile}
            memberIds={idMembers}
            maxFaceCount={2}
            showMore={true}
            avatarSize={AVATAR_SIZE}
            renderAvatar={renderAvatar}
          />
        )}
      </RouterLink>
    </div>
  );

  return (
    <>
      {isNudgeEnabled && (
        <NudgeTooltipPulse
          hasPulse={cardToHighlight === id}
          pulseColor="#8BBDD9"
        >
          {content}
        </NudgeTooltipPulse>
      )}
      {!isNudgeEnabled && content}
    </>
  );
};
