import React, { useCallback } from 'react';
import styles from './BoardHeaderOrgMenuPopoverButton.less';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts/useUpgradePromptRules';
import { Spinner } from '@trello/nachos/spinner';
import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { useFeatureFlag } from '@trello/feature-flag-client';

const format = forNamespace(['upgrade-path-audit']);

export const BoardHeaderOrgMenuPopoverButton: React.FC<{ orgId: string }> = ({
  orgId,
}) => {
  const isRepackagingGTM = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );

  const {
    isEligible,
    loading: loadingFreeTrial,
    isPremium,
    isEnterpriseMember,
  } = useFreeTrialEligibilityRules(orgId, { skip: !orgId });

  const {
    openPlanSelection,
    loading: loadingUpgradePrompt,
  } = useUpgradePromptRules(orgId, `board-header-org-menu-button-${orgId}`);

  const onClick = useCallback(() => {
    openPlanSelection();

    Analytics.sendClickedLinkEvent({
      linkName: 'bcUpgradePrompt',
      source: 'boardWorkspaceInlineDialog',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: !!isEligible,
        promptId: 'newTeamInlinePrompt',
      },
    });
  }, [isEligible, openPlanSelection, orgId]);

  if (loadingFreeTrial || loadingUpgradePrompt) {
    return <Spinner centered />;
  }

  const text =
    isRepackagingGTM && isEligible
      ? format('try-trello-premium')
      : isRepackagingGTM && !isEligible
      ? format('upgrade-workspace')
      : isEligible
      ? format('try-free-trial-bc')
      : format('upgrade-to-bc');

  if (isPremium || isEnterpriseMember) {
    return null;
  }
  return (
    <div className={styles.ctaDivider}>
      <a role="button" className={styles.ctaButton} onClick={onClick}>
        {text}
      </a>
    </div>
  );
};
