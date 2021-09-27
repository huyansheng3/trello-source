import React, { ReactNode } from 'react';
import { ListItem, ListItemProps } from './ListItem';
import { Lozenge } from 'app/src/components/Lozenge';
import styles from './ViewsListItem.less';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';

interface ViewListItemPermissionLevel {
  permissionLevel: string;
}

export interface ViewsListItemProps extends Omit<ListItemProps, 'tooltipText'> {
  title: string;
  secondaryIcon?: ReactNode;
  isBeta?: boolean;
  prefs?: ViewListItemPermissionLevel;
  active?: boolean;
}

export const ViewsListItem: React.FunctionComponent<ViewsListItemProps> = ({
  icon,
  href,
  title,
  isBeta,
  onClick,
  secondaryIcon,
  active,
}) => {
  return (
    <ListItem
      key={href}
      icon={icon}
      href={href}
      tooltipText={title}
      onClick={onClick}
      data-test-id={WorkspaceNavigationTestIds.ViewsListItem}
      secondaryIcon={secondaryIcon}
      active={active}
    >
      <div className={styles.body}>
        <p className={styles.viewName}>{title}</p>
        {isBeta ? (
          <span
            className={styles.lozenge}
            data-test-id={WorkspaceNavigationTestIds.BetaPill}
          >
            <Lozenge color="blue">Beta</Lozenge>
          </span>
        ) : null}
      </div>
    </ListItem>
  );
};
