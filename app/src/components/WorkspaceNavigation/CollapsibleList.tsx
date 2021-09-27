import React, { useCallback, useState, ReactNode } from 'react';
import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { UpIcon } from '@trello/nachos/icons/up';
import styles from './CollapsibleList.less';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('workspace_navigation');
interface CollapsibleListProps {
  ariaLabel?: string;
  title: string;
  controls?: ReactNode;
  onClick?: (expanded: boolean) => void;
  itemCount?: number;
  defaultCollapsed?: boolean;
}

export const CollapsibleList: React.FunctionComponent<CollapsibleListProps> = ({
  ariaLabel,
  title,
  controls,
  children,
  onClick,
  itemCount,
  defaultCollapsed,
}) => {
  const [expanded, setExpanded] = useState(!defaultCollapsed);
  const handleToggleClick = useCallback(() => {
    setExpanded(!expanded);
    if (onClick) {
      onClick(!expanded);
    }
  }, [setExpanded, expanded, onClick]);

  return (
    <div
      className={styles.container}
      data-test-id={WorkspaceNavigationTestIds.CollapsibleList}
    >
      <div className={styles.header}>
        <h2 className={styles.title} aria-label={ariaLabel}>
          {`${title} ${
            itemCount !== undefined && !expanded ? `(${itemCount})` : ''
          }`}
        </h2>
        <div className={styles.controls}>
          {controls}
          <Button
            iconBefore={
              expanded ? (
                <UpIcon size="small" color="quiet" />
              ) : (
                <DownIcon size="small" color="quiet" />
              )
            }
            onClick={handleToggleClick}
            aria-label={`${format('toggle-title', { title: title })}`}
            aria-expanded={expanded}
            className={styles.toggleButton}
          />
        </div>
      </div>
      <ul
        className={classNames(
          styles.content,
          !expanded && styles.contentCollapsed,
        )}
        data-test-id={WorkspaceNavigationTestIds.CollapsibleListItems}
      >
        {children}
      </ul>
    </div>
  );
};
