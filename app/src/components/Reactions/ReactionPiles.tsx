import classNames from 'classnames';
import { EmojiPickerPopover } from 'app/src/components/EmojiPickerPopover';
import { BaseEmoji } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { toggleReaction } from 'app/gamma/src/modules/state/models/reactions';
import React, { FunctionComponent, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyId } from 'app/gamma/src/selectors/session';
import { ReactionModel } from 'app/gamma/src/types/models';
import { any, chain, random } from 'underscore';
import { createReaction } from './createReaction';
import { Reaction } from './Reaction';
import { ReactionAddButton } from './ReactionAddButton';
import { ReactionTooltip } from './ReactionTooltip';

import { ReactionAnalyticsContextProvider } from 'app/src/components/ReactionAnalyticsContext';
import styles from './ReactionPiles.less';
import { usePopover, Popover } from '@trello/nachos/popover';
import { shouldFireConfetti } from 'app/scripts/views/card/should-fire-confetti';
import confetti from 'canvas-confetti';

const EMOJI_POPOVER_WIDTH = 408;

interface ReactionPilesProps {
  idAction?: string;
  canReact: boolean;
  reactions: ReactionModel[];
}

export const ReactionPiles: FunctionComponent<ReactionPilesProps> = ({
  idAction,
  canReact,
  reactions,
}) => {
  const {
    toggle,
    hide,
    popoverProps,
    triggerRef,
  } = usePopover<HTMLDivElement>();
  const idMe = useSelector(getMyId);
  const dispatch = useDispatch();

  const groupedReactions = useMemo(() => {
    return chain(reactions)
      .groupBy((reaction) => reaction.emoji.colons)
      .map((grouped) => ({
        reaction: grouped[0],
        count: grouped.length,
        tooltip: (
          <ReactionTooltip
            members={grouped.map((reaction) => reaction.member)}
            colons={grouped[0].emoji.colons}
            myId={idMe}
          />
        ),
        isMyReaction: any(grouped, (reaction) => reaction.idMember === idMe),
      }))
      .value();
  }, [idMe, reactions]);

  const isEmpty = groupedReactions.length === 0;

  const confettiCheck = useCallback(
    (emoji: BaseEmoji, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (
        shouldFireConfetti(emoji.native) &&
        !any(groupedReactions, (groupedReaction) => {
          return (
            groupedReaction.isMyReaction &&
            groupedReaction.reaction.emoji.id === emoji.id.toUpperCase()
          );
        })
      ) {
        confetti({
          angle: random(55, 125),
          spread: random(50, 70),
          particleCount: random(40, 75),
          origin: {
            x: e.pageX / window.innerWidth,
            y: e.pageY / window.innerHeight,
          },
          disableForReducedMotion: true,
        });
      }
    },
    [groupedReactions],
  );

  const onSelectEmojiMartEmoji = useCallback(
    (emoji: BaseEmoji, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const reactionModel = createReaction(emoji, idAction || '');

      confettiCheck(emoji, e);

      dispatch(
        toggleReaction({ idAction: idAction || '', reaction: reactionModel }),
      );
      hide();
    },
    [confettiCheck, hide, idAction, dispatch],
  );

  const onReactionClick = useCallback(
    (
      reactionModel: ReactionModel,
      e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
      confettiCheck(reactionModel.emoji, e);
      dispatch(
        toggleReaction({ idAction: idAction || '', reaction: reactionModel }),
      );
    },
    [confettiCheck, idAction, dispatch],
  );

  return (
    <ReactionAnalyticsContextProvider idAction={idAction}>
      <div
        className={classNames(styles.reactionPiles, {
          [styles.empty]: isEmpty,
        })}
      >
        {groupedReactions.map(({ reaction, count, isMyReaction, tooltip }) => (
          <Reaction
            key={`${reaction.id}_${reaction.idEmoji}`}
            reaction={reaction}
            count={count}
            isMyReaction={isMyReaction}
            isDisabled={!canReact}
            tooltip={tooltip}
            onClick={onReactionClick}
          />
        ))}
        <div ref={triggerRef}>
          <ReactionAddButton
            isSmall={isEmpty}
            isDisabled={!canReact}
            onClick={toggle}
            isActive={popoverProps.isVisible}
          />
        </div>
        <Popover
          {...popoverProps}
          noHorizontalPadding
          noVerticalPadding
          dangerous_width={EMOJI_POPOVER_WIDTH}
        >
          <EmojiPickerPopover onSelectEmoji={onSelectEmojiMartEmoji} />
        </Popover>
      </div>
    </ReactionAnalyticsContextProvider>
  );
};
