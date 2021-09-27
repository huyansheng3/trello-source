import React from 'react';
import { ApplicationEntity } from './types';

import styles from './Application.less';

interface ApplicationProps extends Pick<ApplicationEntity, 'text'> {}

export const Application: React.FunctionComponent<ApplicationProps> = ({
  text,
}) => {
  return <span className={styles.fontWeightBold}>{text}</span>;
};
