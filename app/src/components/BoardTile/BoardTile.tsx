import React from 'react';
import classNames from 'classnames';
import styles from './BoardTile.less';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { BoardTemplateBadge } from 'app/src/components/BoardTemplateBadge';
import { StarredBoardButton } from './StarredBoardButton';
import { hasUnreadActivity } from '@trello/boards';
import { memberId } from '@trello/session-cookie';

interface BackgroundImageScaledProps {
  readonly width: number;
  readonly height: number;
  readonly url: string;
}

export interface BoardTileProps {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly maxBoardStarPosition: number;
  readonly boardStarId?: string;
  readonly dateLastView?: Date;
  readonly dateLastActivity?: Date;
  readonly boardTileClassName?: string;
  readonly onStarClick?: () => void;
  readonly onBoardClick?: () => void;
  readonly organizationDisplayName?: string;
  readonly isTemplate?: boolean;
  readonly background?: string;
  readonly backgroundTile?: boolean;
  readonly backgroundImage?: string;
  readonly backgroundColor?: string;
  readonly backgroundImageScaled?: BackgroundImageScaledProps[];
}

const getBackgroundStyle = (
  background?: string,
  backgroundTile?: boolean,
  backgroundImage?: string,
  backgroundColor?: string,
  backgroundImageScaled?: BackgroundImageScaledProps[],
) => {
  const css: React.CSSProperties = {};

  if (background) {
    const image = backgroundTile
      ? { url: backgroundImage }
      : // some old boards have not gone through image scaling,
        // so <board response>.prefs.backgroundImageScaled === null
        smallestPreviewBiggerThan(backgroundImageScaled, 400, 200) || {
          url: backgroundImage,
        };
    if (image && image.url) {
      css.backgroundImage = `url('${image.url}')`;
    }

    css.backgroundColor = backgroundColor || undefined;
  }

  return css;
};

export const BoardTile: React.FunctionComponent<BoardTileProps> = ({
  id,
  name,
  url,
  maxBoardStarPosition,
  dateLastView,
  dateLastActivity,
  background,
  backgroundTile,
  backgroundImage,
  backgroundColor,
  backgroundImageScaled,
  organizationDisplayName,
  isTemplate,
  boardTileClassName,
  onStarClick,
  onBoardClick,
  boardStarId,
}) => {
  const tileBackgroundStyle = getBackgroundStyle(
    background,
    backgroundTile,
    backgroundImage,
    backgroundColor,
    backgroundImageScaled,
  );

  const isUnread = hasUnreadActivity({
    dateLastView,
    dateLastActivity,
  });

  const containerStyles = classNames(styles.boardTile, boardTileClassName);
  const boardDescriptionStyles = classNames(
    styles.boardDescription,
    organizationDisplayName && styles.fullHeight,
  );

  const unreadStyles = classNames(
    styles.unreadMarker,
    isUnread && styles.isUnread,
    boardStarId && styles.isStarred,
  );
  const actionsWrapperStyles = classNames(
    styles.actionsWrapper,
    isUnread && styles.isUnread,
    boardStarId && styles.isStarred,
  );
  const starStyles = classNames(
    styles.utilityAction,
    boardStarId && styles.isStarred,
    styles.actionSmall,
  );

  return (
    <div className={containerStyles}>
      <RouterLink
        href={url || `/b/${id}`}
        className={styles.boardLink}
        title={name}
        onClick={onBoardClick}
      >
        <div className={styles.boardThumbnail} style={tileBackgroundStyle}>
          {isUnread && <div className={unreadStyles} />}
        </div>
        <div className={boardDescriptionStyles}>
          <div className={styles.boardName}>{name}</div>
          {organizationDisplayName && (
            <div className={styles.boardSubName}>{organizationDisplayName}</div>
          )}
        </div>
        {isTemplate && (
          <div className={styles.boardTemplateBadgeContainer}>
            <BoardTemplateBadge
              dangerous_className={styles.boardTemplateBadge}
            />
          </div>
        )}
        <div className={actionsWrapperStyles}>
          <div className={starStyles}>
            <StarredBoardButton
              idBoard={id}
              boardStarId={boardStarId}
              maxBoardStarPosition={maxBoardStarPosition}
              memberId={memberId || ''}
              onClick={onStarClick}
            />
          </div>
        </div>
      </RouterLink>
    </div>
  );
};
