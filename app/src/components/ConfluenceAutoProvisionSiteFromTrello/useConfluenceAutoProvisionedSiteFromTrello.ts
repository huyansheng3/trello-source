import { useCallback } from 'react';
import { memberId } from '@trello/session-cookie';
import { ActionSubjectIdType, Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { featureFlagClient } from '@trello/feature-flag-client';
import { ConfluenceAutoProvisionedSiteFromTrello } from '@atlassian/switcher/types';
import { useAutoProvisioningConfluenceBundled } from 'app/src/components/AutoProvisioningSpotlight/useAutoProvisioningConfluenceBundled';
import {
  useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery,
  ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDocument,
  ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery,
} from './ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery.generated';
import { useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation } from './ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation.generated';
import { SwitcherNudgeState } from 'app/src/components/SwitcherSpotlight/usePtSwitcherNudgeState';

export enum ConfluenceAutoProvisionedSiteFromTrelloMessageIds {
  DISMISS_CONFLUENCE_SWITCHER_NOTIFICATION = 'mando-auto-provisioning-dismiss-confluence-switcher-notification',
  DISMISS_NUDGE = 'mando-auto-provisioning-dismiss-nudge',
  DISMISS_CARD = 'mando-auto-provisioning-dismiss-card',
  DISMISS_HIGHLIGHT = 'mando-auto-provisioning-dismiss-highlight',
}

export const messageIdToComponent: Record<
  ConfluenceAutoProvisionedSiteFromTrelloMessageIds,
  ActionSubjectIdType
> = {
  [ConfluenceAutoProvisionedSiteFromTrelloMessageIds.DISMISS_CONFLUENCE_SWITCHER_NOTIFICATION]:
    'confluenceAutoProvisionSwitcherBanner',
  [ConfluenceAutoProvisionedSiteFromTrelloMessageIds.DISMISS_NUDGE]:
    'autoProvisioningDismissNudge',
  [ConfluenceAutoProvisionedSiteFromTrelloMessageIds.DISMISS_CARD]:
    'autoProvisioningDismissCard',
  [ConfluenceAutoProvisionedSiteFromTrelloMessageIds.DISMISS_HIGHLIGHT]:
    'autoProvisioningDismissHighlight',
};

const format = forTemplate('confluence_auto_provisioned');

export const useConfluenceAutoProvisionedSiteFromTrello = (
  isPtEnabled: boolean,
  ptNudgeState: SwitcherNudgeState,
  messageId: ConfluenceAutoProvisionedSiteFromTrelloMessageIds = ConfluenceAutoProvisionedSiteFromTrelloMessageIds.DISMISS_CONFLUENCE_SWITCHER_NOTIFICATION,
): ConfluenceAutoProvisionedSiteFromTrello => {
  const { cardHidden, nudgeHidden, highlightHidden } = ptNudgeState;
  const [
    dismissOneTimeMessage,
  ] = useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation();
  const {
    data,
  } = useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery({
    variables: { memberId: memberId || 'me' },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  const isEnabled = featureFlagClient.get(
    'trello-confluence-crossflow-auto-provisioning-experiment',
    false,
  );

  const { oneTimeMessagesDismissed: dismissedMessages } = data?.member || {};
  const confluenceSwitcherNotificationDismissed = !!dismissedMessages?.includes(
    messageId,
  );
  const hasPtBeenDismissedCompletely =
    !!cardHidden && !!nudgeHidden && !!highlightHidden;
  const isPtDisabledOrBeenDismissed = hasPtBeenDismissedCompletely
    ? hasPtBeenDismissedCompletely
    : !isPtEnabled;
  const shouldSkipCheckingAutoProvisioningTrait =
    !isPtDisabledOrBeenDismissed ||
    confluenceSwitcherNotificationDismissed ||
    !isEnabled;
  const hasHadConfluenceBundled = useAutoProvisioningConfluenceBundled(
    shouldSkipCheckingAutoProvisioningTrait,
  );
  const showConfluenceBannerNotification =
    isEnabled &&
    !confluenceSwitcherNotificationDismissed &&
    isPtDisabledOrBeenDismissed &&
    hasHadConfluenceBundled;

  const onConfluenceBannerNotificationClicked = useCallback(() => {
    dismissOneTimeMessage({
      variables: {
        messageId,
        memberId: memberId || 'me',
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addOneTimeMessagesDismissed: {
          id: 'me',
          oneTimeMessagesDismissed: dismissedMessages?.concat([messageId]),
          __typename: 'Member',
        },
      },
      update: (cache, result) => {
        const data = cache.readQuery<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery>(
          {
            query: ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDocument,
            variables: { memberId: memberId || '' },
          },
        );

        if (!data?.member) {
          return;
        }

        // Make sure we're not losing any messages in the cache with out optimistic response
        const mergedMessagesDismissed = new Set([
          ...(data?.member?.oneTimeMessagesDismissed || []),
          ...(result?.data?.addOneTimeMessagesDismissed
            ?.oneTimeMessagesDismissed || dismissedMessages!),
        ]);
        cache.writeQuery<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery>(
          {
            query: ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDocument,
            data: {
              ...data,
              member: {
                ...data.member,
                oneTimeMessagesDismissed: [...mergedMessagesDismissed],
              },
            },
          },
        );
      },
    });
    Analytics.sendDismissedComponentEvent({
      componentType: 'banner',
      componentName: messageIdToComponent[messageId],
      source: 'atlassianSwitcher',
    });
  }, [dismissOneTimeMessage, dismissedMessages, messageId]);

  const displayedBannerMessage = format('free with trello');

  return {
    showConfluenceBannerNotification,
    onConfluenceBannerNotificationClicked,
    displayedBannerMessage,
  };
};
