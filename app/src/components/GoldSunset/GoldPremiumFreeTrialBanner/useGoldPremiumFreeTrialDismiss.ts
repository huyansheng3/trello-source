import { useCallback, useMemo } from 'react';
import { useGoldPremiumFreeTrialBannerQuery } from './GoldPremiumFreeTrialBannerQuery.generated';
import { useDismissGoldPremiumFreeTrialMutation } from './DismissGoldPremiumFreeTrialMutation.generated';
import { ApolloError } from '@apollo/client';
import { memberId } from '@trello/session-cookie';

interface GoldPremiumFreeTrialData {
  loading: boolean;
  error?: ApolloError | Error;
  hasDismissedFromBoardView: boolean;
  dismissBanner: () => void;
}

export const GOLD_PROMO_FREE_TRIAL_PAGE = '/page/gold-promo-free-trial';
const messageId = 'nusku.gold-premium-free-trial-banner';

export const useGoldPremiumFreeTrialDismiss = (): GoldPremiumFreeTrialData => {
  const { data, loading, error } = useGoldPremiumFreeTrialBannerQuery({
    variables: {
      memberId: memberId || '',
    },
  });

  const oneTimeMessagesDismissed = useMemo(
    () => data?.member?.oneTimeMessagesDismissed ?? [],
    [data?.member?.oneTimeMessagesDismissed],
  );
  const hasDismissedFromBoardView = Boolean(
    oneTimeMessagesDismissed?.includes(messageId),
  );

  const [
    dismiss,
    { loading: isDismissing },
  ] = useDismissGoldPremiumFreeTrialMutation();

  const dismissBanner = useCallback(() => {
    if (isDismissing || hasDismissedFromBoardView) {
      return;
    }

    dismiss({
      variables: {
        memberId: memberId ?? 'me',
        messageId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addOneTimeMessagesDismissed: {
          id: 'me',
          oneTimeMessagesDismissed: [...oneTimeMessagesDismissed, messageId],
          __typename: 'Member',
        },
      },
    });
  }, [
    dismiss,
    isDismissing,
    hasDismissedFromBoardView,
    oneTimeMessagesDismissed,
  ]);

  return {
    loading,
    error,
    hasDismissedFromBoardView,
    dismissBanner,
  };
};
