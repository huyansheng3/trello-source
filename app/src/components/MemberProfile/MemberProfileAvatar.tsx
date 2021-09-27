import React from 'react';
import { MemberModel } from 'app/gamma/src/types/models';

import styles from './MemberProfileAvatar.less';

interface MemberProfileAvatarProps {
  member: MemberModel;
}

export const MemberProfileAvatar: React.FunctionComponent<MemberProfileAvatarProps> = ({
  member,
}) =>
  member.avatars ? (
    <img
      className={styles.memberProfileAvatar}
      src={member.avatars.original}
      width={256}
      height={256}
      alt={`${member.name} (${member.username})`}
      title={`${member.name} (${member.username})`}
    />
  ) : null;
