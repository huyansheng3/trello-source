import classNames from 'classnames';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import React from 'react';
import { useWorkspaceNavigation } from './useWorkspaceNavigation';
import styles from './WorkspaceNavigationExpandedContainer.less';

interface WorkspaceNavigationExpandedContainerProps {}

export const WorkspaceNavigationExpandedContainer: React.FC<WorkspaceNavigationExpandedContainerProps> = (
  props,
) => {
  // expandedViewStatus allows us to hide the container AFTER the nav
  // has finished transitioning off screen to prevent:
  // * tabbing to off-screen items in the nav
  // * screen readers from being able to read off-screen items in the nav
  const [{ expandedViewStatus }] = useWorkspaceNavigation();
  return (
    <div
      className={classNames(styles.container, {
        [styles.containerHidden]:
          expandedViewStatus === 'hidden-transition-complete',
      })}
      data-test-id={WorkspaceNavigationTestIds.WorkspaceNavigationExpanded}
    >
      {props.children}
    </div>
  );
};
