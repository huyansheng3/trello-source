import React from 'react';
import { CanonicalAvatar as Avatar } from '@atlassian/trello-canonical-components';
import { MemberIcon } from '@trello/nachos/icons/member';
import { ProfileCardWrapper } from './ProfileCardWrapper';
import styles from './ProfileCardSkeleton.less';

interface Props {
  onClose: () => void;
}

export const ProfileCardSkeleton: React.FC<Props> = ({ onClose }) => (
  <ProfileCardWrapper onClose={onClose}>
    <div className={styles.cardTop}>
      <Avatar size={88} lightBackground className={styles.avatar}>
        <MemberIcon size="large" color="quiet" />
      </Avatar>
      <div className={styles.profileInfo}>
        <div className={styles.fullName}>
          <div className={styles.fullNameSkeleton} />
        </div>
        <div className={styles.atName}>
          @<div className={styles.atNameSkeleton} />
        </div>
      </div>
    </div>
  </ProfileCardWrapper>
);
