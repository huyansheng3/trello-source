import React from 'react';
import { CloseIcon } from '@trello/nachos/icons/close';
import styles from './PageContainer.less';

interface PageContainerProps {
  onClose(): void;
}
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className={styles.container}>
      <span className={styles.close} role="button" onClick={onClose}>
        <CloseIcon size="large" color="dark" />
      </span>
      {children}
    </div>
  );
};
