import React, { useCallback, useEffect } from 'react';

import { forTemplate } from '@trello/i18n';

import { useDialog } from 'app/src/components/Dialog';
import {
  LazySpotlightManager,
  LazySpotlightTarget,
  LazySpotlightTransition,
  LazySpotlight,
} from 'app/src/components/Onboarding';
import {
  WorkspaceNavigationTourOptInModal,
  WorkspaceNavigationTourOptOutFeedbackModal,
} from 'app/src/components/WorkspaceNavigationTour';

import { useSpotlight } from './useSpotlight';
import { Analytics } from '@trello/atlassian-analytics';
import { featureFlagClient, useFeatureFlag } from '@trello/feature-flag-client';
import { useWorkspace } from '@trello/workspaces';

const format = forTemplate('sidebar_spotlight');

export const SpotlightNavigationCollapsed: React.FunctionComponent = ({
  children,
}) => {
  const [spotlightScreenState, setSpotlightScreenState] = useSpotlight();
  const { idWorkspace, idBoard } = useWorkspace();

  // we want to lazy load this spotlight once the spotlight series starts
  const showSpotlight = !!spotlightScreenState;

  const isModalEnabled = useFeatureFlag(
    'teamplates.web.nav-opt-out-modal',
    false,
  );

  const {
    dialogProps: optInModalProps,
    isOpen: isOptInModalOpen,
    show: triggerOptInModal,
  } = useDialog();
  const {
    dialogProps: optOutFeedbackModalProps,
    isOpen: isOptOutFeedbackModalOpen,
    show: triggerOptOutFeedbackModal,
  } = useDialog();

  const handleCollectOptOutFeedback = useCallback(() => {
    triggerOptOutFeedbackModal();
  }, [triggerOptOutFeedbackModal]);

  const handleOptOut = useCallback(() => {
    featureFlagClient.setOverride('teamplates.web.left-nav-bar', false);
    featureFlagClient.setOverride(
      'teamplates.web.existing-left-nav-users',
      false,
    );
    // This is the only way to get the navigation UI to refresh after opting out
    window.location.reload();
  }, []);

  useEffect(() => {
    if (
      showSpotlight &&
      spotlightScreenState?.screen === 'fourth-nav-collapse' &&
      idBoard
    ) {
      Analytics.sendScreenEvent({
        name: 'navigationCollapsedSpotlightModal',
        containers: {
          ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
          board: { id: idBoard },
        },
      });
    }
  }, [showSpotlight, spotlightScreenState?.screen, idWorkspace, idBoard]);

  const handleNextClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'spotlightNextButton',
      source: 'navigationCollapsedSpotlightModal',
      containers: {
        ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
        ...(idBoard ? { board: { id: idBoard } } : {}),
      },
    });
    setSpotlightScreenState(undefined);
    if (isModalEnabled) {
      triggerOptInModal();
    }
  }, [
    setSpotlightScreenState,
    idWorkspace,
    idBoard,
    isModalEnabled,
    triggerOptInModal,
  ]);

  return !showSpotlight ? (
    <>
      {isOptInModalOpen && (
        <WorkspaceNavigationTourOptInModal
          {...optInModalProps}
          onOptOut={handleCollectOptOutFeedback}
        />
      )}
      {isOptOutFeedbackModalOpen && (
        <WorkspaceNavigationTourOptOutFeedbackModal
          {...optOutFeedbackModalProps}
          onOptOut={handleOptOut}
          orgId={idWorkspace || undefined}
        />
      )}
      {children}
    </>
  ) : (
    <LazySpotlightManager>
      <LazySpotlightTarget name="workspaceNavigationCollapsedSpotlight">
        {children}
      </LazySpotlightTarget>
      <LazySpotlightTransition>
        {spotlightScreenState?.screen === 'fourth-nav-collapse' ? (
          <LazySpotlight
            actions={[
              {
                onClick: handleNextClick,
                text: format('got-it'),
              },
            ]}
            dialogPlacement="right top"
            target="workspaceNavigationCollapsedSpotlight"
            key="workspaceNavigationCollapsedSpotlight"
            dialogWidth={275}
            actionsBeforeElement={`${spotlightScreenState?.totalScreens.toLocaleString()}/${spotlightScreenState?.totalScreens.toLocaleString()}`}
          >
            <p>{format('sidebar-will-stay-out-of-way')}</p>
          </LazySpotlight>
        ) : null}
      </LazySpotlightTransition>
    </LazySpotlightManager>
  );
};
