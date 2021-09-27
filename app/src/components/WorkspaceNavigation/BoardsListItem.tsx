import React, { useCallback, useRef, useEffect } from 'react';
import { hasUnreadActivity } from '@trello/boards';
import { Analytics } from '@trello/atlassian-analytics';
import { ListItem, ListItemProps } from './ListItem';
import { BoardTemplateBadge } from './BoardTemplateBadge';
import styles from './BoardsListItem.less';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
import { useWorkspace } from '@trello/workspaces';
import { StarIcon } from '@trello/nachos/icons/star';

type PermissionLevelType = 'public' | 'private' | 'org' | 'enterprise';

const format = forTemplate('workspace_navigation');

export interface BoardsListItemProps
  extends Omit<ListItemProps, 'tooltipText' | 'icon'> {
  isTemplate?: boolean;
  id: string;
  name: string;
  dateLastActivity?: string;
  dateLastView?: string;
  permissionLevel?: PermissionLevelType;
  backgroundColor?: string;
  backgroundUrl?: string;
  orgId?: string;
  type?: string;
  starred?: boolean;
}

const getBackgroundStyle = ({
  backgroundUrl,
  backgroundColor,
}: {
  backgroundUrl?: string;
  backgroundColor?: string;
}) => {
  const css: React.CSSProperties = {};

  if (backgroundUrl) {
    css.backgroundImage = `url('${backgroundUrl}')`;
  }

  css.backgroundColor = backgroundColor || undefined;

  return css;
};

// Keep a reference to the previous state values so that we can employ a
// "stale while revalidate" approach to rendering
function usePreviousWhileLoading<T>(
  value: T,
  isLoading: boolean,
  initialValue: T,
): T {
  const previousValue = useRef<T>(initialValue);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    previousValue.current = value;
  }, [value, isLoading]);

  return isLoading ? previousValue.current : value;
}

export const BoardsListItem = ({
  id,
  name,
  href,
  isTemplate,
  dateLastActivity,
  dateLastView,
  backgroundColor,
  backgroundUrl,
  orgId,
  type,
  starred,
}: BoardsListItemProps) => {
  const workspace = useWorkspace();
  const idBoard = usePreviousWhileLoading(
    workspace.idBoard,
    workspace.isLoading,
    null,
  );
  const boardThumbnailStyle = getBackgroundStyle({
    backgroundColor,
    backgroundUrl,
  });

  const hasRecentActivity = hasUnreadActivity({
    dateLastActivity: dateLastActivity ? new Date(dateLastActivity) : undefined,
    dateLastView: dateLastView ? new Date(dateLastView) : undefined,
  });

  const handleClick = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'menuItem',
      actionSubjectId: 'boardMenuItem',
      source: 'currentWorkspaceNavigationDrawer',
      containers: {
        board: {
          id,
        },
        organization: {
          id: orgId,
        },
      },
      attributes: {
        type,
      },
    });
  }, [id, orgId, type]);

  const active = idBoard === id;
  let ariaLabel = name;
  if (active) {
    ariaLabel = format('currently-active', { name });
  } else if (hasRecentActivity) {
    ariaLabel = format('recently-active', { name });
  }

  return (
    <ListItem
      tooltipText={ariaLabel}
      onClick={handleClick}
      href={href || `/b/${id}`}
      icon={
        <div className={styles.boardThumbnailWrapper}>
          <div className={styles.boardThumbnail} style={boardThumbnailStyle} />
          {hasRecentActivity ? (
            <div
              className={styles.statusCircle}
              data-test-id={
                WorkspaceNavigationTestIds.BoardRecentActivityIndicator
              }
            />
          ) : null}
        </div>
      }
      active={active}
      aria-label={ariaLabel}
    >
      <p className={styles.boardName}>{name}</p>
      {isTemplate ? <BoardTemplateBadge /> : null}
      {starred ? (
        <span className={styles.starIconContainer}>
          <StarIcon size="small" color="yellow" />
        </span>
      ) : null}
    </ListItem>
  );
};
