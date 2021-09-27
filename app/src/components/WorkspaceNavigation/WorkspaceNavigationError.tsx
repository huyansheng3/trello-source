import React, { useEffect } from 'react';
import { Null } from 'app/src/components/Null';
import { workspaceNavigationHiddenState } from './workspaceNavigationHiddenState';

/*
	Top level error handler component for workspace nav
	The component sets nav to hidden, and then returns Null
	No sidebar will be shown, and since hidden=true, other
	components will set their styles accordingly
*/

interface WorkspaceNavigationErrorProps {}

export const WorkspaceNavigationError: React.FunctionComponent<WorkspaceNavigationErrorProps> = () => {
  useEffect(() => {
    workspaceNavigationHiddenState.setValue({ hidden: true });
  }, []);

  return <Null />;
};
