import classNames from 'classnames';
import React, { ReactEventHandler, useCallback, useContext } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { ReactionAnalyticsContext } from 'app/src/components/ReactionAnalyticsContext';
import styles from './ReactionAddButton.less';

interface ReactionAddButtonProps {
  isSmall?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: ReactEventHandler<HTMLDivElement>;
}

export const ReactionAddButton: React.FC<ReactionAddButtonProps> = ({
  onClick,
  isSmall = false,
  isActive = false,
  isDisabled = false,
}) => {
  const { boardId, cardId, listId, actionId } = useContext(
    ReactionAnalyticsContext,
  );
  const onReactionClick = useCallback(
    (event) => {
      if (!isDisabled && onClick) {
        onClick(event);
        Analytics.sendClickedButtonEvent({
          buttonName: 'addEmojiButton',
          source: 'emojiPickerInlineDialog',
          containers: {
            board: {
              id: boardId,
            },
            card: {
              id: cardId,
            },
            list: {
              id: listId,
            },
          },
          attributes: {
            actionId,
          },
        });
      }
    },
    [isDisabled, onClick, boardId, cardId, actionId, listId],
  );

  return (
    <div
      className={classNames(styles.reactionAddButton, {
        [styles.small]: isSmall,
        [styles.active]: isActive,
        [styles.disabled]: isDisabled,
      })}
      onClick={onReactionClick}
      role="button"
    >
      <span className={styles.icon}>
        <svg className={styles.iconSvg} viewBox="0 0 16 16">
          <path
            d="M13.97 8.646l-.014-.001a6 6 0 1 0-5.448 5.344 1 1 0 0 1 .247 1.98v.005a8 8 0 1 1 7.212-7.384l.003.06a1 1 0 0 1-2 0v-.004zM9 5.566c0-.496.448-.9 1-.9s1 .404 1 .9v1.2c0 .498-.448.9-1 .9s-1-.402-1-.9v-1.2zM4.66 9.982a1 1 0 0 1 1.78-.912c.387.756.903 1.082 1.676 1.082.783 0 1.33-.338 1.76-1.111a1 1 0 0 1 1.748.97c-.774 1.395-1.982 2.141-3.508 2.141-1.537 0-2.732-.757-3.456-2.17zm9.36 2.056h.988a1.003 1.003 0 1 1 0 2.006h-.987v1.003a1.003 1.003 0 1 1-2.006 0v-1.003h-1.012a1.003 1.003 0 0 1 0-2.006h1.012v-1.008a1.003 1.003 0 1 1 2.006 0v1.008zM5 5.567c0-.497.448-.9 1-.9s1 .403 1 .9v1.2c0 .497-.448.9-1 .9s-1-.403-1-.9v-1.2z"
            fillRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
};
