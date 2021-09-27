import { NotificationTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { Tooltip } from '@trello/nachos/tooltip';
import React, { useCallback } from 'react';
import { ReactionModel } from 'app/gamma/src/types/models';
import { Emoji } from 'app/src/components/Emoji';

import styles from './Reaction.less';

interface ReactionOwnProps {
  reaction: ReactionModel;
  count: number;
  isMyReaction?: boolean;
  isDisabled?: boolean;
  onClick?: (
    emoji: ReactionModel,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  tooltip?: React.ReactNode;
}

interface ReactionProps extends ReactionOwnProps {}

export const Reaction: React.FC<ReactionProps> = ({
  reaction,
  count,
  isMyReaction = false,
  isDisabled = false,
  onClick,
  tooltip,
}) => {
  const { emoji } = reaction;

  const _onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isDisabled || !onClick) {
        return;
      }

      onClick(reaction, e);
    },
    [isDisabled, reaction, onClick],
  );

  const renderedReaction = (
    <div
      className={classNames(styles.reaction, {
        [styles.myReaction]: isMyReaction,
        [styles.disabled]: isDisabled,
      })}
      onClick={_onClick}
      role={onClick && 'button'}
      data-test-id={`${NotificationTestIds.Reaction}${emoji.colons}`}
    >
      <Emoji emoji={emoji.colons} />
      <div className={styles.reactionCount}>{count > 99 ? '99+' : count}</div>
    </div>
  );

  return (
    <React.Fragment key={reaction.id}>
      {tooltip && !isDisabled ? (
        <Tooltip content={tooltip}>{renderedReaction}</Tooltip>
      ) : (
        renderedReaction
      )}
    </React.Fragment>
  );
};
