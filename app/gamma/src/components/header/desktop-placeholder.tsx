/* eslint-disable import/no-default-export */
import React from 'react';
import styles from './header.less';

const DesktopPlaceholder = React.memo(() => (
  <div className={styles.desktopPlaceholder} data-placeholder="desktop" />
));

export default DesktopPlaceholder;
