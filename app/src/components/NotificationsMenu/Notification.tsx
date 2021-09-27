import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { getReactionsByActionId } from 'app/gamma/src/selectors/reactions';
import { getMe } from 'app/gamma/src/selectors/members';
import { AppCreatorModel, NotificationModel } from 'app/gamma/src/types/models';
import { getActionLink } from './getActionLink';
import { isCommentLike } from './isCommentLike';
import { shouldGenerateActionLink } from './shouldGenerateActionLink';
import { ActionEntities } from 'app/src/components/ActionEntities/ActionEntities';
import { ReactionPiles } from 'app/src/components/Reactions/ReactionPiles';
import { NotificationDate } from './NotificationDate';
import { NotificationIcon, hasIcon } from './NotificationIcon';
import { NotificationAppCreator } from './NotificationAppCreator';
import { NotificationSupplement } from './NotificationSupplement';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';

import styles from './Notification.less';
import { ActionEntityType } from 'app/src/components/ActionEntities';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('notification');

export interface NotificationOwnProps
  extends Pick<
    NotificationModel,
    'display' | 'type' | 'data' | 'idAction' | 'idMemberCreator'
  > {
  date?: Date;
  appCreator?: AppCreatorModel | null;
  className?: string;
  iconClassName?: string;
  entitiesClassName?: string;
  canReact: boolean;
  isReactable?: boolean;
  reactionAdded?: boolean;
  cardId?: string;
  cardIdList?: string;
  cardIdBoard?: string;
}

export const isSystemNotification = (notificationType?: string) =>
  notificationType &&
  (notificationType === 'cardDueSoon' ||
    notificationType === 'declinedInvitationToBoard' ||
    notificationType === 'declinedInvitationToOrganization');

const onReactionClick = (e: React.MouseEvent) => {
  // This prevents the popover from closing. Because if you click to remove
  // the last reaction from a reaction pile that pile gets hidden, the popover
  // component thinks that a component from outside the popover was clicked on,
  // which causes it to close.
  e.preventDefault();
};

export const Notification: React.FunctionComponent<NotificationOwnProps> = ({
  canReact,
  isReactable,
  date,
  display,
  type,
  data,
  appCreator,
  idAction,
  className,
  iconClassName,
  entitiesClassName,
  reactionAdded,
  cardId,
  cardIdList,
  cardIdBoard,
  idMemberCreator,
}) => {
  const {
    reactions,
    memberAvatars,
    memberAvatarSource,
    memberInitials,
    memberName,
    memberUsername,
  } = useSelector((state: State) => {
    const me = getMe(state);

    return {
      reactions: getReactionsByActionId(state, idAction),
      memberAvatars: me?.avatars,
      memberAvatarSource: me?.avatarSource,
      memberInitials: me?.initials,
      memberName: me?.name,
      memberUsername: me?.username,
    };
  });

  const { translationKey } = display;

  const onClickComment = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'notificationCommentLink',
      source: 'notificationsInlineDialog',
      containers: {
        card: {
          id: cardId,
        },
        list: {
          id: cardIdList,
        },
        board: {
          id: cardIdBoard,
        },
      },
    });
  };

  const onClickEntity = (entity: ActionEntityType) => {
    if (entity.type === 'comment') {
      onClickComment();
    }
  };

  // if the value of isReactable isn't set, it's because
  // its an old notification before the field was added.
  // in this case set as true and
  // let isCommentLike() be the deciding factor (which was the old behavior anyway).
  // 30 days after isReactable was added, delete this logic as all
  // old notifications should have expired by then.
  isReactable = isReactable ?? true;

  return (
    <div
      className={classNames(
        styles.notification,
        {
          [styles.system]: isSystemNotification(type),
          [styles.hasIcon]: hasIcon(translationKey),
        },
        className,
      )}
    >
      {reactionAdded && memberAvatarSource ? (
        <MemberAvatarUnconnected
          avatarSource={memberAvatarSource}
          fullName={memberName || ''}
          username={memberUsername || ''}
          avatars={memberAvatars || undefined}
          initials={memberInitials}
          size={20}
          className={styles.memberAvatarReactedComment}
        />
      ) : (
        <NotificationIcon
          iconKey={translationKey}
          className={classNames(styles.icon, iconClassName)}
          url={
            shouldGenerateActionLink({ type, data })
              ? getActionLink({ type, data, idAction })
              : undefined
          }
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => type === 'commentCard' && onClickComment()}
        />
      )}

      <div className={classNames(styles.entities, entitiesClassName)}>
        {type === 'cardDueSoon' && <strong>{format('reminder')} </strong>}
        <ActionEntities
          display={display}
          localeGroup="notificationsGrouped"
          actionData={data}
          actionType={type}
          idAction={idAction}
          reactionAdded={reactionAdded}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={onClickEntity}
        />
        {date && <NotificationDate date={date} />}
        {date && appCreator && appCreator?.name && (
          <NotificationAppCreator
            appCreator={appCreator}
            boardId={data?.board?.id}
            boardUrl={data?.board?.url}
            cardId={cardId}
            type={type}
          />
        )}
        {isCommentLike({ type, data }) && isReactable && (
          <div
            className={styles.reactionPiles}
            onClick={onReactionClick}
            role={'button'}
          >
            <ReactionPiles
              reactions={reactions}
              idAction={idAction}
              canReact={canReact}
            />
          </div>
        )}
        <NotificationSupplement
          type={type}
          data={data}
          appCreator={appCreator}
          idMemberCreator={idMemberCreator}
        />
      </div>
    </div>
  );
};
