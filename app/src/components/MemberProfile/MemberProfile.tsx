import cx from 'classnames';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import React from 'react';
import { MemberModel } from 'app/gamma/src/types/models';
import styles from './MemberProfile.less';
import { CloseButton } from 'app/src/components/CloseButton';
import { CloseIcon } from '@trello/nachos/icons/close';

interface MemberProfileProps {
  onClose: () => void;
  onExpandAvatar: () => void;
  member: MemberModel;
}

export const MemberProfile: React.FunctionComponent<MemberProfileProps> = ({
  onExpandAvatar,
  member,
  onClose,
}) => (
  // The preventDefault prevents the notifications popover from closing. Because the
  // memberProfile popover is closed after being clicked, the popover component
  // thinks that a component from outside the popover was clicked on, which would
  // cause it to close otherwise
  <div className={styles.memberProfile}>
    <CloseButton
      className={styles.headerClose}
      onClick={onClose}
      closeIcon={<CloseIcon size="small" color="quiet" />}
    />
    <div className={styles.profileAvatar}>
      <MemberAvatarUnconnected
        avatarSource={member.avatarSource}
        fullName={member.name}
        username={member.username}
        avatars={member.avatars || undefined}
        initials={member.initials}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={
          member.avatars
            ? (e: React.MouseEvent) => {
                e.preventDefault();
                onExpandAvatar();
              }
            : () => {}
        }
        size={50}
        className={cx(styles.memberAvatar, {
          [styles.memberAvatarInitials]: !member.avatars,
        })}
        deactivated={member.activityBlocked}
      />
    </div>
    <div className={styles.profileInfo}>
      <>
        <div className={styles.memberName}>
          <RouterLink href={`/${member.username}`}>{member.name}</RouterLink>
        </div>
        <div className={styles.memberUsername}>@{member.username}</div>
      </>
    </div>
  </div>
);
