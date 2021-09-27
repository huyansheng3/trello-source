import classNames from 'classnames';
import React from 'react';
import { LabelEntity } from './types';

import styles from './Label.less';

interface LabelProps extends Pick<LabelEntity, 'color' | 'text'> {}

export const Label: React.FunctionComponent<LabelProps> = ({ color, text }) => {
  return (
    <span
      className={classNames(styles.cardLabel, styles[color])}
      title={text || `${color} label (default)`}
    >
      {text ? text : ''}
    </span>
  );
};
