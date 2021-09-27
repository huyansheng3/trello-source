import React from 'react';
import { MoveIcon } from '@trello/nachos/icons/move';
import { Button } from '@trello/nachos/button';
import styles from './EmptyState.less';

interface EmptyStateProps {
  linkText?: string;
  text: string;
  icon: React.ReactNode;
  appearance?: 'important';
  onClickLink?: (e: React.MouseEvent) => void;
}

export const EmptyState: React.FunctionComponent<EmptyStateProps> = ({
  linkText,
  text,
  icon,
  onClickLink,
  appearance,
}) => {
  return (
    <div
      className={
        appearance === 'important'
          ? styles.containerImportant
          : styles.container
      }
    >
      <div className={styles.iconTextContainer}>
        <div className={styles.iconContainer}>{icon}</div>
        <p
          className={
            appearance === 'important' ? styles.textImportant : styles.text
          }
        >
          {text}
        </p>
      </div>
      {linkText && onClickLink ? (
        <Button
          className={
            appearance === 'important'
              ? styles.createLinkButtonImportant
              : styles.createLinkButton
          }
          appearance="link"
          onClick={onClickLink}
        >
          {linkText}
          <span
            className={
              appearance === 'important'
                ? styles.moveIconImportant
                : styles.moveIcon
            }
          >
            <MoveIcon
              size="small"
              color={appearance === 'important' ? 'light' : 'quiet'}
            />
          </span>
        </Button>
      ) : null}
    </div>
  );
};
