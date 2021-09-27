import classNames from 'classnames';
import { MemberIcon } from '@trello/nachos/icons/member';
import { forTemplate } from '@trello/i18n';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';
import React, { FunctionComponent, useCallback } from 'react';
import { AppCreatorModel, MemberModel } from 'app/gamma/src/types/models';
import { NotificationMemberReacted } from './NotificationMemberReacted';
import { NotificationMemberName } from './NotificationMemberName';

import styles from './NotificationMember.less';
import { usePopover, Popover, PopoverScreen } from '@trello/nachos/popover';
import { MemberProfileAvatar } from 'app/src/components/MemberProfile/MemberProfileAvatar';
import { MemberProfile } from 'app/src/components/MemberProfile';
import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { LazyProfileCard } from 'app/src/components/ProfileCard';

const format = forTemplate('notification');

interface NotificationMemberProps {
  appCreator?: AppCreatorModel | null;
  idNotification?: string;
  deleted?: boolean;
  date?: Date;
  member?: MemberModel;
  className?: string;
  reactionAdded?: boolean;
  idAction?: string;
  boardId?: string;
  boardUrl?: string;
  cardId?: string;
  cardIdList?: string;
  cardIdBoard?: string;
  type?: string;
}

enum Screen {
  MemberProfileScreen,
  ExpandedAvatarScreen,
}

export const NotificationMember: FunctionComponent<NotificationMemberProps> = ({
  appCreator,
  idNotification = '',
  idAction,
  member,
  deleted = false,
  date,
  className,
  reactionAdded,
  boardId,
  boardUrl,
  cardId,
  cardIdList,
  cardIdBoard,
  type,
}) => {
  const onShow = useCallback(() => {
    Analytics.sendScreenEvent({
      name: 'notificationMemberInlineDialog',
      containers: {
        board: {
          id: cardIdBoard,
        },
        card: {
          id: cardId,
        },
        list: {
          id: cardIdList,
        },
      },
    });
  }, [cardId, cardIdList, cardIdBoard]);

  const {
    triggerRef,
    popoverProps,
    toggle,
    push,
    hide,
  } = usePopover<HTMLDivElement>({
    initialScreen: Screen.MemberProfileScreen,
    onShow,
  });

  const onClickAvatar = () => {
    if (deleted || !member) {
      return;
    }
    toggle();
  };

  const isNewProfileCard = useFeatureFlag('btg.atlaskit-profile-card', false);

  if (!member) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.notificationMember,
        {
          [styles.clickable]: !deleted,
        },
        className,
      )}
      role="button"
    >
      {deleted ? (
        <>
          <MemberIcon size="large" dangerous_className={styles.avatar} />
          <div
            className={classNames(styles.memberName, {
              [styles.deletedMember]: deleted,
            })}
          >
            {format('deleted-account')}
          </div>
        </>
      ) : (
        <>
          <div className={styles.avatarContainer} ref={triggerRef}>
            <MemberAvatarUnconnected
              avatarSource={member.avatarSource}
              fullName={member.name}
              username={member.username}
              initials={member.initials}
              avatars={member.avatars || undefined}
              gold={false}
              className={styles.avatar}
              deactivated={member.activityBlocked}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onClickAvatar}
            />
          </div>
          {reactionAdded ? (
            <NotificationMemberReacted
              appCreator={appCreator}
              boardId={boardId}
              boardUrl={boardUrl}
              cardId={cardId}
              type={type}
              idNotification={idNotification}
              idAction={idAction}
              date={date}
              memberName={member?.name}
              // eslint-disable-next-line react/jsx-no-bind
              onClickNotification={onClickAvatar}
            />
          ) : (
            <NotificationMemberName
              appCreator={appCreator}
              boardId={boardId}
              boardUrl={boardUrl}
              cardId={cardId}
              type={type}
              date={date}
              memberName={member?.name}
              // eslint-disable-next-line react/jsx-no-bind
              onClickNotification={onClickAvatar}
            />
          )}
          <Popover {...popoverProps}>
            <PopoverScreen
              id={Screen.MemberProfileScreen}
              noVerticalPadding
              noHorizontalPadding={!isNewProfileCard}
            >
              {isNewProfileCard ? (
                <LazyProfileCard
                  onClose={hide}
                  memberId={member?.id}
                  className={styles.profileCard}
                />
              ) : (
                <MemberProfile
                  onClose={hide}
                  member={member}
                  // eslint-disable-next-line react/jsx-no-bind
                  onExpandAvatar={() => push(Screen.ExpandedAvatarScreen)}
                />
              )}
            </PopoverScreen>
            <PopoverScreen id={Screen.ExpandedAvatarScreen} title={member.name}>
              <MemberProfileAvatar member={member} />
            </PopoverScreen>
          </Popover>
        </>
      )}
    </div>
  );
};
