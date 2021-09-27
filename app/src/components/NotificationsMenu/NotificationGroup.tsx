import { isTabActive } from '@trello/browser';
import { NotificationTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { Auth } from 'app/scripts/db/auth';
import { Notification, isSystemNotification } from './Notification';
import { NotificationArchiveButton } from './NotificationArchiveButton';
import { NotificationGroupCard } from './NotificationGroupCard';
import { AspectRatio, NotificationHeader } from './NotificationHeader';
import { NotificationMember } from './NotificationMember';
import { NotificationToggleReadButton } from './NotificationToggleReadButton';
import { setNotificationGroupRead } from 'app/gamma/src/modules/state/models/notifications';
import { State } from 'app/gamma/src/modules/types';
import React, { useCallback } from 'react';
import AnimateHeight from 'react-animate-height';
import { useDispatch, useSelector } from 'react-redux';
import { checkReactionPerms } from 'app/gamma/src/selectors/reactions';
import { getMe } from 'app/gamma/src/selectors/members';
import { getBoardById } from 'app/gamma/src/selectors/boards';
import { getTeamById } from 'app/gamma/src/selectors/teams';
import { hasUnreadNotifications as doesHaveUnreadNotifications } from 'app/gamma/src/selectors/notifications';
import { ActionDisplayType } from 'app/src/components/ActionEntities';
import {
  NotificationGroupModel,
  NotificationModel,
} from 'app/gamma/src/types/models';
import { isCommentLike } from './isCommentLike';
import { mapNotificationsToArchive } from './mapNotificationsToArchive';
import styles from './NotificationGroup.less';
import { Analytics } from '@trello/atlassian-analytics';

export const ANIMATION_DURATION = 500;

interface GroupedNotificationsProps {
  canReact: boolean;
  cardId?: string;
  cardIdList?: string;
  cardIdBoard?: string;
  notifications: NotificationModel[];
}

class GroupedNotifications extends React.Component<GroupedNotificationsProps> {
  idPreviousMemberCreator: string | undefined;

  render() {
    const {
      canReact,
      notifications,
      cardId,
      cardIdList,
      cardIdBoard,
    } = this.props;

    if (!notifications || notifications.length === 0) {
      return null;
    }

    this.idPreviousMemberCreator = '';

    return (
      <>
        {notifications.map((notification, i) => {
          const { memberCreator, idMemberCreator } = notification;

          const isSameMemberCreator =
            idMemberCreator === this.idPreviousMemberCreator;
          const isMemberCreatorMe = idMemberCreator === Auth.myId();

          this.idPreviousMemberCreator = idMemberCreator;

          const isNotificationCommentLike = isCommentLike(notification);
          const isMemberDeleted = this.isMemberDeleted(notification.display);
          const reactionAdded = notification.type === 'reactionAdded';

          return (
            <React.Fragment key={i}>
              {(memberCreator || isMemberDeleted) &&
                (!isSameMemberCreator || reactionAdded) &&
                !isMemberCreatorMe && (
                  <NotificationMember
                    appCreator={notification.appCreator}
                    idNotification={notification.id}
                    idAction={notification.idAction}
                    member={memberCreator}
                    deleted={isMemberDeleted}
                    date={
                      isNotificationCommentLike ? notification.date : undefined
                    }
                    className={styles.notificationMember}
                    boardId={notification.data?.board?.id}
                    boardUrl={notification.data?.board?.url}
                    type={notification.type}
                    cardId={cardId}
                    cardIdList={cardIdList}
                    cardIdBoard={cardIdBoard}
                    reactionAdded={reactionAdded}
                  />
                )}
              <Notification
                {...notification}
                date={
                  !isNotificationCommentLike ? notification.date : undefined
                }
                key={notification.id}
                className={classNames(styles.notification, {
                  [styles.system]: isSystemNotification(notification.type),
                })}
                entitiesClassName={styles.notificationEntities}
                canReact={canReact}
                reactionAdded={reactionAdded}
                cardId={cardId}
                cardIdList={cardIdList}
                cardIdBoard={cardIdBoard}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  }

  isMemberDeleted = (display: ActionDisplayType) =>
    display.entities &&
    display.entities.memberCreator &&
    display.entities.memberCreator.type === 'translatable' &&
    display.entities.memberCreator.translationKey ===
      'notification_deleted_account';
}

interface NotificationsArchiveProps {
  notifications: NotificationModel[];
  canReact: boolean;
  cardId?: string;
  cardIdList?: string;
  cardIdBoard?: string;
}

interface NotificationsArchiveState {
  isArchiveVisible: boolean;
}

class NotificationsArchive extends React.Component<
  NotificationsArchiveProps,
  NotificationsArchiveState
> {
  constructor(props: NotificationsArchiveProps) {
    super(props);

    this.state = {
      isArchiveVisible: false,
    };
  }

  render() {
    const {
      notifications,
      canReact,
      cardId,
      cardIdList,
      cardIdBoard,
    } = this.props;
    const { isArchiveVisible } = this.state;

    const archiveButtonProps = {
      active: isArchiveVisible,
      onClick: this.toggleArchive,
      duration: ANIMATION_DURATION,
    };

    if (!notifications || notifications.length === 0) {
      return null;
    }

    return (
      <>
        <NotificationArchiveButton {...archiveButtonProps} />
        <AnimateHeight
          height={isArchiveVisible ? 'auto' : 0}
          easing="ease-in-out"
          duration={ANIMATION_DURATION}
          className={styles.archive}
        >
          <GroupedNotifications
            notifications={notifications}
            cardId={cardId}
            cardIdList={cardIdList}
            cardIdBoard={cardIdBoard}
            canReact={canReact}
          />
          <NotificationArchiveButton {...archiveButtonProps} simple={true} />
        </AnimateHeight>
      </>
    );
  }

  toggleArchive = () => {
    const { cardId, cardIdList, cardIdBoard } = this.props;
    const { isArchiveVisible } = this.state;

    Analytics.sendClickedButtonEvent({
      buttonName: 'notificationsArchiveButton',
      source: 'notificationsInlineDialog',
      containers: {
        card: {
          id: cardId,
        },
        board: {
          id: cardIdList,
        },
        list: {
          id: cardIdBoard,
        },
      },
      attributes: {
        open: !isArchiveVisible,
      },
    });

    this.setState({
      isArchiveVisible: !isArchiveVisible,
    });
  };
}

interface NotificationGroupOwnProps extends NotificationGroupModel {
  transitionOnInitialRender?: boolean;
  collapsed: boolean;
}

export interface NotificationGroupProps extends NotificationGroupOwnProps {
  testId?: NotificationTestIds;
}

const mapNotificationToBoard = (state: State, idBoard: string) => {
  const boardModel = getBoardById(state, idBoard);
  if (!boardModel || !boardModel?.name) {
    return null;
  }
  const url = boardModel.background?.scaled?.sort(
    (a, b) => a.width - b.width,
  )?.[0]?.url;
  let image;
  if (url) {
    image = { url, aspectRatio: AspectRatio.Rectangle };
  }
  const color = boardModel.background?.color || undefined;
  return {
    name: boardModel.name,
    image,
    color,
  };
};

const mapNotificationToTeam = (
  state: State,
  notification: NotificationModel,
) => {
  const idOrganization =
    notification?.data?.team && notification?.data?.team?.id;
  if (!idOrganization) {
    return null;
  }

  const organizationModel = getTeamById(state, idOrganization);
  if (!organizationModel) {
    return null;
  }
  const organizationImage = organizationModel?.logos?.['50']
    ? {
        url: organizationModel.logos['50'],
        aspectRatio: AspectRatio.Square,
      }
    : undefined;

  return {
    name: organizationModel.displayName,
    image: organizationImage,
    icon: OrganizationIcon,
  };
};

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  collapsed,
  notifications,
  board,
  card,
  idGroup,
  id,
}) => {
  const dispatch = useDispatch();
  const setNotificationRead = useCallback(
    (idNotificationGroup: string, read: boolean, notificationIds: string[]) => {
      dispatch(
        setNotificationGroupRead({
          idGroup: idNotificationGroup,
          read,
          notificationIds,
        }),
      );
    },
    [dispatch],
  );

  const { hasUnreadNotifications, headerEntity, canReact } = useSelector(
    (state: State) => {
      const hasUnreadNotifications = doesHaveUnreadNotifications(state, id);

      const me = getMe(state);
      const idBoard = board?.id || notifications?.[0]?.data?.board?.id;
      const boardEntity = idBoard
        ? mapNotificationToBoard(state, idBoard)
        : null;
      const teamEntity = mapNotificationToTeam(state, notifications?.[0]);
      return {
        hasUnreadNotifications,
        headerEntity: boardEntity || teamEntity || undefined,
        canReact:
          idBoard && me ? checkReactionPerms(state, me, idBoard) : false,
      };
    },
  );

  const toggleReadStatus = useCallback(() => {
    const { active } = mapNotificationsToArchive(notifications);

    Analytics.sendClickedButtonEvent({
      buttonName: 'notificationReadStatusButton',
      source: 'notificationsInlineDialog',
      containers: {
        card: {
          id: card?.id,
        },
        board: {
          id: card?.idBoard,
        },
        list: {
          id: card?.idList,
        },
      },
      attributes: {
        read: hasUnreadNotifications,
      },
    });

    setNotificationRead(
      idGroup,
      hasUnreadNotifications,
      active.map((n) => n.id),
    );
  }, [
    card,
    hasUnreadNotifications,
    idGroup,
    notifications,
    setNotificationRead,
  ]);

  if (!notifications.length) {
    return null;
  }

  const { archive, active } = mapNotificationsToArchive(notifications);

  const firstNotification = notifications[0];

  if (!board && firstNotification.data) {
    board = firstNotification.data.board;
  }

  if (!card && firstNotification.data) {
    card = firstNotification.data.card;
  }
  const doesHaveCard = !!card;

  const renderNotificationHeader = () => {
    if (doesHaveCard) {
      return <NotificationGroupCard board={board} card={card} />;
    }
    if (!headerEntity?.name) {
      return null;
    }
    return <NotificationHeader entity={headerEntity} />;
  };

  return (
    <AnimateHeight
      height={collapsed ? 0 : 'auto'}
      easing="ease-in-out"
      duration={
        /* For some reason, when the tab is not active,
         * the opacity gets animated, but the height does
         * not. This leads to a very jarring experience if
         * sombody changes the visibility filter in one tab
         * and then switches to another. Thus, we make the
         * animation duration 0 if the tab is not active
         * so that there is essentially no animation in
         * inactive tabs.
         */
        isTabActive() ? ANIMATION_DURATION : 0
      }
      animateOpacity
    >
      <div
        className={classNames(styles.notificationGroupHolder, {
          [styles.unread]: hasUnreadNotifications,
        })}
        data-test-id={
          hasUnreadNotifications
            ? NotificationTestIds.UnreadNotification
            : NotificationTestIds.ReadNotification
        }
      >
        <div
          className={classNames(styles.notificationGroup, {
            [styles.hasNoCard]: !doesHaveCard,
          })}
        >
          <div className={styles.actions}>
            <NotificationToggleReadButton
              className={styles.notificationToggleReadButton}
              markRead={hasUnreadNotifications}
              onClick={toggleReadStatus}
            />
          </div>

          {renderNotificationHeader()}
          <NotificationsArchive
            notifications={archive}
            cardId={card?.id}
            cardIdList={card?.idList}
            cardIdBoard={card?.idBoard}
            canReact={canReact}
          />
          <GroupedNotifications
            notifications={active}
            cardId={card?.id}
            cardIdList={card?.idList}
            cardIdBoard={card?.idBoard}
            canReact={canReact}
          />
        </div>
      </div>
    </AnimateHeight>
  );
};
