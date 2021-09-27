import React, { useEffect, useCallback } from 'react';

import { sendErrorEvent } from '@trello/error-reporting';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { TrelloStorage } from '@trello/storage';
import { memberId } from '@trello/session-cookie';
import { idToDate, isDateToday } from '@trello/dates';

import { forTemplate } from '@trello/i18n';
import { Feature } from 'app/scripts/debug/constants';
import { useDialog } from 'app/src/components/Dialog';
import {
  LazySpotlightManager,
  LazySpotlightTarget,
  LazySpotlightTransition,
  LazySpotlight,
} from 'app/src/components/Onboarding';
import { WorkspaceNavigationTourIntroModal } from 'app/src/components/WorkspaceNavigationTour';

import { useWorkspaceNavigationOneTimeMessagesDismissedQuery } from './WorkspaceNavigationOneTimeMessagesDismissedQuery.generated';
import { useAddWorkspaceNavEnabledOneTimeMessageMutation } from './AddWorkspaceNavEnabledOneTimeMessageMutation.generated';
import { useWorkspaceNavigation } from './useWorkspaceNavigation';
import { useSpotlight } from './useSpotlight';
import { isCardRoute, useRouteId } from '@trello/routes';
const SpotlightPng = require('resources/images/workspace-navigation/spotlight.png');
import styles from './SpotlightNavigationExpanded.less';
import { Analytics } from '@trello/atlassian-analytics';
import { useWorkspace } from '@trello/workspaces';
import { useWindowFocus } from './useWindowFocus';

const format = forTemplate('sidebar_spotlight');

export const SIDEBAR_SPOTLIGHT_VIEWED_DATE_KEY =
  'sidebar-spotlight-viewed-date';
const SIDEBAR_SPOTLIGHT_ONE_TIME_MESSAGE = 'workspace-nav-spotlight';

export const SpotlightNavigationExpanded: React.FunctionComponent = ({
  children,
}) => {
  const routeId = useRouteId();
  const isCard = isCardRoute(routeId);
  const [
    { expandedViewStatus },
    setWorkspaceNavigationState,
  ] = useWorkspaceNavigation();
  const [spotlightScreenState, setSpotlightScreenState] = useSpotlight();
  const focused = useWindowFocus();
  const showSpotlight = spotlightScreenState?.screen === 'first-nav-expanded';

  const spotlightEnabled = useFeatureFlag(
    'teamplates.web.sidebar-onboarding-spotlight',
    false,
  );
  const isModalEnabled = useFeatureFlag(
    'teamplates.web.nav-opt-out-modal',
    false,
  );
  const { idWorkspace, idBoard } = useWorkspace();

  const {
    data,
    error: oneTimeMessagesDismissedError,
  } = useWorkspaceNavigationOneTimeMessagesDismissedQuery();
  const [
    dismissOneTimeMessage,
  ] = useAddWorkspaceNavEnabledOneTimeMessageMutation();

  const hasNotDismissedSidebarSpotlight =
    data?.member?.oneTimeMessagesDismissed &&
    !data?.member?.oneTimeMessagesDismissed?.includes(
      SIDEBAR_SPOTLIGHT_ONE_TIME_MESSAGE,
    );

  useEffect(() => {
    if (oneTimeMessagesDismissedError) {
      sendErrorEvent(oneTimeMessagesDismissedError, {
        tags: {
          ownershipArea: 'trello-teamplates',
          feature: Feature.WorkspaceNavigation,
        },
      });
    }
  }, [oneTimeMessagesDismissedError]);

  useEffect(() => {
    if (
      showSpotlight &&
      spotlightScreenState?.screen === 'first-nav-expanded' &&
      idBoard
    ) {
      Analytics.sendScreenEvent({
        name: 'navigationExpandedSpotlightModal',
        containers: {
          ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
          board: { id: idBoard },
        },
      });
    }
  }, [showSpotlight, spotlightScreenState?.screen, idWorkspace, idBoard]);

  const triggerSpotlight = useCallback(() => {
    setSpotlightScreenState({
      screen: 'first-nav-expanded',
      totalScreens: 4,
    });
  }, [setSpotlightScreenState]);

  const { dialogProps, isOpen: isModalOpen, show: triggerModal } = useDialog({
    onHide: () => {
      triggerSpotlight();
    },
  });

  const triggerOnboarding = useCallback(() => {
    dismissOneTimeMessage({
      variables: { messageId: SIDEBAR_SPOTLIGHT_ONE_TIME_MESSAGE },
    });
    TrelloStorage.set(SIDEBAR_SPOTLIGHT_VIEWED_DATE_KEY, Date.now());
    if (isModalEnabled) {
      triggerModal();
    } else {
      triggerSpotlight();
    }
  }, [dismissOneTimeMessage, isModalEnabled, triggerModal, triggerSpotlight]);

  useEffect(() => {
    // There were cases where users were seeing the spotlight twice
    // That's likely because the oneTimeMessagesDismissed update was
    // not received before the user completed the spotlight flow
    // So here we also check the viewed date key set synchronously
    const hasSeenSidebarSpotlight = !!TrelloStorage.get(
      SIDEBAR_SPOTLIGHT_VIEWED_DATE_KEY,
    );
    if (
      hasNotDismissedSidebarSpotlight &&
      !spotlightScreenState &&
      memberId &&
      focused
    ) {
      if (isCard) return;
      // this is a new user or the spotlight is not enabled or the user
      // has actually already seen the spotlight
      // add message to oneTimeMessages dismissed but don't show spotlight
      if (
        isDateToday(idToDate(memberId)) ||
        !spotlightEnabled ||
        hasSeenSidebarSpotlight
      ) {
        dismissOneTimeMessage({
          variables: { messageId: SIDEBAR_SPOTLIGHT_ONE_TIME_MESSAGE },
        });
        return;
      }

      if (expandedViewStatus === 'visible-transition-complete') {
        triggerOnboarding();
      } else {
        setWorkspaceNavigationState({ expanded: true });
      }
    }
  }, [
    hasNotDismissedSidebarSpotlight,
    expandedViewStatus,
    spotlightEnabled,
    spotlightScreenState,
    setWorkspaceNavigationState,
    dismissOneTimeMessage,
    triggerOnboarding,
    isCard,
    focused,
  ]);

  const spotlightIndex = 1;
  const nextScreen = 'second-top-nav-dropdowns';

  const handleNextClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'spotlightNextButton',
      source: 'navigationExpandedSpotlightModal',
      containers: {
        ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
        ...(idBoard ? { board: { id: idBoard } } : {}),
      },
    });
    setSpotlightScreenState({ screen: nextScreen });
    setWorkspaceNavigationState({
      expanded: false,
    });
  }, [
    nextScreen,
    setSpotlightScreenState,
    setWorkspaceNavigationState,
    idWorkspace,
    idBoard,
  ]);

  if (!showSpotlight || isModalOpen) {
    return (
      <>
        {isModalOpen && <WorkspaceNavigationTourIntroModal {...dialogProps} />}
        {children}
      </>
    );
  }

  return (
    <LazySpotlightManager>
      <LazySpotlightTarget name="workspaceNavigationSpotlight">
        <div className={styles.spotlightContainer}>{children}</div>
      </LazySpotlightTarget>
      <LazySpotlightTransition>
        {spotlightScreenState?.screen === 'first-nav-expanded' ? (
          <LazySpotlight
            actions={[
              {
                onClick: handleNextClick,
                text: format('next'),
              },
            ]}
            dialogPlacement="right top"
            target="workspaceNavigationSpotlight"
            key="workspaceNavigationSpotlight"
            image={SpotlightPng}
            dialogWidth={275}
            actionsBeforeElement={`${spotlightIndex.toLocaleString()}/${spotlightScreenState?.totalScreens.toLocaleString()}`}
          >
            <p>{format('welcome-to-new-sidebar')}</p>
          </LazySpotlight>
        ) : null}
      </LazySpotlightTransition>
    </LazySpotlightManager>
  );
};
