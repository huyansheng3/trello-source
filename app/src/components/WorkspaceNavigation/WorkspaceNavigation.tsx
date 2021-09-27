/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { useWorkspace } from '@trello/workspaces';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';

import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

import { useWorkspaceNavigation } from './useWorkspaceNavigation';
import { useWorkspaceNavigationHidden } from './useWorkspaceNavigationHidden';
import { BoardSearchContext } from './BoardSearchContext';
import { WorkspaceNavigationExpanded } from './WorkspaceNavigationExpanded';
import { WorkspaceNavigationCollapsed } from './WorkspaceNavigationCollapsed';
import { WorkspaceNavigationCollapsedWrapper } from './WorkspaceNavigationCollapsedWrapper';

import styles from './WorkspaceNavigation.less';
import { registerShortcut, Key } from '@trello/keybindings';
import { WorkspaceNavigationExpandedError } from './WorkspaceNavigationExpandedError';

const LOADING_DELAY = 500;

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

export const WorkspaceNavigation: React.FunctionComponent = () => {
  const workspace = useWorkspace();
  const [{ expanded }, setWorkspaceNavigationState] = useWorkspaceNavigation();
  const [
    { hidden },
    setWorkspaceNavigationHidden,
  ] = useWorkspaceNavigationHidden();

  const idWorkspace = usePreviousWhileLoading(
    workspace.idWorkspace,
    workspace.isLoading,
    null,
  );
  const idBoard = usePreviousWhileLoading(
    workspace.idBoard,
    workspace.isLoading,
    null,
  );
  const isGlobal = usePreviousWhileLoading(
    workspace.isGlobal,
    workspace.isLoading,
    false,
  );

  const [isLoading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onOpenBracketKeypress = useCallback(() => {
    if (!hidden) {
      setWorkspaceNavigationState({ expanded: !expanded });

      Analytics.sendPressedShortcutEvent({
        shortcutName: 'workspaceShortcut',
        keyValue: '[',
        source: getScreenFromUrl(),
        attributes: { expanded },
      });
    }
  }, [setWorkspaceNavigationState, expanded, hidden]);

  // Only present the loading state after 500ms to prevent flashing
  // a spinner to the user too frequently
  useEffect(() => {
    let timeout: number;

    if (workspace.isLoading) {
      timeout = window.setTimeout(() => {
        setLoading(true);
      }, LOADING_DELAY);
    } else {
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [workspace.isLoading, setLoading]);

  useEffect(() => {
    if (isGlobal !== hidden) {
      setWorkspaceNavigationHidden({ hidden: isGlobal });
    }
  }, [isGlobal, hidden, setWorkspaceNavigationHidden]);

  useEffect(() => {
    registerShortcut(onOpenBracketKeypress, {
      key: Key.OpenBracket,
    });
  }, [onOpenBracketKeypress]);

  const toggleVisibility = useCallback(() => {
    setWorkspaceNavigationState({ expanded: !expanded });

    Analytics.sendClickedButtonEvent({
      buttonName: 'workspaceNavigationExpandCollapseButton',
      source: 'currentWorkspaceNavigationDrawer',
      attributes: { expanded },
    });
  }, [setWorkspaceNavigationState, expanded]);

  const ExpandedErrorView = useCallback(() => {
    return (
      <WorkspaceNavigationExpandedError isGlobal={isGlobal} isHidden={hidden} />
    );
  }, [isGlobal, hidden]);

  const CollapsedErrorView = useCallback(() => {
    return (
      <WorkspaceNavigationCollapsed
        toggleVisibility={toggleVisibility}
        isGlobal={isGlobal}
        isHidden={hidden}
      />
    );
  }, [toggleVisibility, isGlobal, hidden]);

  return (
    <ComponentWrapper
      data-test-id={WorkspaceNavigationTestIds.WorkspaceNavigation}
    >
      <BoardSearchContext.Provider
        value={{
          query: searchQuery,
          setQuery: setSearchQuery,
        }}
      >
        <nav
          data-test-id={WorkspaceNavigationTestIds.WorkspaceNavigationNav}
          className={classNames(styles.navContainer, {
            [styles.navContainerCollapsed]: !expanded,
            [styles.navContainerExpanded]: expanded,
            [styles.navContainerHidden]: hidden,
          })}
        >
          <ExpandedContainer isVisible={expanded}>
            <ErrorBoundary
              errorHandlerComponent={ExpandedErrorView}
              tags={{
                ownershipArea: 'trello-teamplates',
                feature: Feature.WorkspaceNavigation,
              }}
            >
              <WorkspaceNavigationExpanded
                toggleVisibility={toggleVisibility}
                idWorkspace={idWorkspace}
                isGlobal={isGlobal}
                isLoading={isLoading}
                idBoard={idBoard || undefined}
                isHidden={hidden}
              />
            </ErrorBoundary>
          </ExpandedContainer>
          <CollapsedContainer isVisible={!expanded}>
            <ErrorBoundary
              errorHandlerComponent={CollapsedErrorView}
              tags={{
                ownershipArea: 'trello-teamplates',
                feature: Feature.WorkspaceNavigation,
              }}
            >
              <WorkspaceNavigationCollapsedWrapper
                toggleVisibility={toggleVisibility}
                idWorkspace={idWorkspace}
                isGlobal={isGlobal}
                isLoading={isLoading}
                idBoard={idBoard || undefined}
                isHidden={hidden}
              />
            </ErrorBoundary>
          </CollapsedContainer>
        </nav>
      </BoardSearchContext.Provider>
    </ComponentWrapper>
  );
};

interface ExpandedContainerProps {
  isVisible: boolean;
}
const ExpandedContainer: React.FunctionComponent<ExpandedContainerProps> = ({
  isVisible,
  children,
}) => {
  const [{ expanded }, setWorkspaceNavigationState] = useWorkspaceNavigation();
  const containerEl = useRef(null);

  const handleOnTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (
        event.currentTarget === containerEl.current &&
        event.propertyName === 'transform'
      ) {
        setWorkspaceNavigationState({
          expandedViewStatus: expanded
            ? 'visible-transition-complete'
            : 'hidden-transition-complete',
        });
      }
    },
    [setWorkspaceNavigationState, expanded],
  );

  return (
    <div
      ref={containerEl}
      className={classNames(
        styles.expandCollapseContainer,
        styles.expandedContainer,
        {
          [styles.expandedNavVisible]: isVisible,
          [styles.expandedNavHidden]: !isVisible,
        },
      )}
      onTransitionEnd={handleOnTransitionEnd}
      data-test-id={
        WorkspaceNavigationTestIds.WorkspaceNavigationExpandedContainer
      }
    >
      {children}
    </div>
  );
};

interface CollapsedContainerProps {
  isVisible: boolean;
}
const CollapsedContainer: React.FunctionComponent<CollapsedContainerProps> = ({
  isVisible,
  children,
}) => {
  return (
    <div
      className={classNames(
        styles.expandCollapseContainer,
        styles.collapsedContainer,
        {
          [styles.collapsedNavVisible]: isVisible,
          [styles.collapsedNavHidden]: !isVisible,
        },
      )}
      data-test-id={
        WorkspaceNavigationTestIds.WorkspaceNavigationCollapsedContainer
      }
    >
      {children}
    </div>
  );
};
