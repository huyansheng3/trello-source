import React from 'react';
import { CloseIcon } from '@trello/nachos/icons/close';
import { CloseButton } from 'app/src/components/CloseButton';
import { BackIcon } from '@trello/nachos/icons/back';
import styles from './ProfileCardWrapper.less';

// Props for a screen other than Screen.Profile
interface ScreenWrapperProps {
  onBack: () => void;
  title: string;
}

interface WrapperProps extends Partial<ScreenWrapperProps> {
  onClose: () => void;
}

// A wrapper that gives "back" and "close" functionalities to sub-screens of the profile card
// If title is not provided, the back and close buttons are overlaid on the children
// If title is provided, the buttons and title are shown above the children with a divider between
export const ProfileCardWrapper: React.FC<
  WrapperProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, onBack, onClose, title, ...reactHTMLAttributes }) => {
  return (
    <div {...reactHTMLAttributes}>
      <div>
        {onBack && (
          <>
            <CloseButton
              className={styles.backButton}
              onClick={onBack}
              closeIcon={<BackIcon size="small" label="Back" />}
              color={!title ? 'light' : 'quiet'}
            />
          </>
        )}
        {title && <div className={styles.title}>{title}</div>}
        <CloseButton
          className={styles.closeButton}
          onClick={onClose}
          closeIcon={
            <CloseIcon
              size="small"
              label="Close"
              color={!title ? 'light' : 'quiet'}
            />
          }
        />
      </div>
      {children}
    </div>
  );
};
