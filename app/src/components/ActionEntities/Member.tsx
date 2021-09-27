import React from 'react';
import { MemberEntity } from './types';

import styles from './Member.less';

interface MemberProps extends Pick<MemberEntity, 'text'> {}

// TODO: Member popover on click

export const Member: React.FunctionComponent<MemberProps> = ({ text }) => {
  return (
    <span className={styles.inlineMember}>
      <span className={styles.fontWeightBold}>{text}</span>
    </span>
  );
};
