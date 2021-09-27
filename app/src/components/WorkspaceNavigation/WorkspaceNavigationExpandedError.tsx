import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
const format = forTemplate('workspace_navigation');
import styles from './WorkspaceNavigationExpandedError.less';
import { CollapseSidebarButton } from './CollapseSidebarButton';
import { useWorkspaceNavigation } from './useWorkspaceNavigation';
import { WorkspaceNavigationExpandedContainer } from './WorkspaceNavigationExpandedContainer';

/*
	Error handler component wrapping WorkspaceNavigationExpanded
	Displays a simple error message and allows user to collapse the
	nav (so that the useless error view doesn't take up real estate)
*/

interface WorkspaceNavigationExpandedErrorProps {
  retryFunction?: () => void;
  isGlobal: boolean;
  isHidden: boolean;
}

export const WorkspaceNavigationExpandedError: React.FC<WorkspaceNavigationExpandedErrorProps> = ({
  retryFunction,
  isGlobal,
  isHidden,
}) => {
  const [{ expanded }, setWorkspaceNavigationState] = useWorkspaceNavigation();

  const toggleVisibility = useCallback(() => {
    setWorkspaceNavigationState({ expanded: !expanded });
  }, [expanded, setWorkspaceNavigationState]);

  if (isGlobal || isHidden) {
    return null;
  }

  return (
    <WorkspaceNavigationExpandedContainer>
      <div className={styles.errorContainer}>
        <div className={styles.topRow}>
          <div className={styles.filler} />
          <CollapseSidebarButton onClick={toggleVisibility} />
        </div>
        <div className={styles.body}>
          <p>{format('error-loading-sidebar')}</p>
          {retryFunction && (
            <Button onClick={retryFunction}>{format('try-again')}</Button>
          )}
          <p>
            {format('access-boards-teams-from-home', {
              homeLink: (
                <a href="/" key="/">
                  {format('home')}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </WorkspaceNavigationExpandedContainer>
  );
};
