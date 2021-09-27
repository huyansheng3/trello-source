import { useState, useEffect, useMemo, useRef } from 'react';
import { sendErrorEvent } from '@trello/error-reporting';
import { useLocation } from '@trello/router';
import {
  getRouteIdFromPathname,
  isBoardRoute,
  isCardRoute,
} from '@trello/routes';
import moment from 'moment';
import { memberId } from '@trello/session-cookie';
import { useFeatureFlag } from '@trello/feature-flag-client';
import {
  useGoldPremiumFreeTrialDismiss,
  GOLD_PROMO_FREE_TRIAL_PAGE,
} from './useGoldPremiumFreeTrialDismiss';
import { useGoldPremiumFreeTrialBannerQuery } from './GoldPremiumFreeTrialBannerQuery.generated';
import { ConditionallyRenderedExperienceHook } from 'app/src/components/ConditionallyRenderedExperienceHook';
import {
  GTM_LAUNCH_DATE,
  useMyGoldPromoFreeTrial,
} from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';

export const useGoldPremiumFreeTrialBanner: ConditionallyRenderedExperienceHook<'goldPremiumFreeTrialExperience'> = () => {
  const goldSunsetEnabled = useFeatureFlag(
    'nusku.repackaging-gtm.gold-sunset',
    false,
  );

  const cancelled = useRef(false);
  const { pathname } = useLocation();
  const isBoardOrCardView = useMemo(
    () =>
      isBoardRoute(getRouteIdFromPathname(pathname)) ||
      isCardRoute(getRouteIdFromPathname(pathname)),
    [pathname],
  );
  const isFreeTrialPage = useMemo(
    () => pathname === GOLD_PROMO_FREE_TRIAL_PAGE,
    [pathname],
  );
  const isGettingStartedPage = useMemo(
    () => pathname.endsWith('/getting-started'),
    [pathname],
  );

  const { refetch: refetchBannerQuery } = useGoldPremiumFreeTrialBannerQuery({
    variables: {
      memberId: memberId || '',
    },
  });

  const {
    loading,
    error,
    hasDismissedFromBoardView,
  } = useGoldPremiumFreeTrialDismiss();

  const { isEligibleMember } = useMyGoldPromoFreeTrial();

  // Only show the banner for 30 days after GTM
  const gtmDate = GTM_LAUNCH_DATE.toISOString();
  const freeTrialOfferEndDate = moment(gtmDate).add(31, 'day');
  const freeTrialOfferHasPassed = freeTrialOfferEndDate.isBefore(
    Date.now(),
    'day',
  );

  const showGoldPremiumFreeTrialBanner =
    goldSunsetEnabled && isEligibleMember && !freeTrialOfferHasPassed;

  const [isAutoShow, setIsAutoShow] = useState(false);

  useEffect(() => {
    return () => {
      cancelled.current = true;
    };
  }, []);

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-nusku',
          feature: 'GoldPremiumFreeTrialBanner',
        },
        extraData: {
          file: 'GoldPremiumFreeTrialBanner.tsx',
        },
      });
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !cancelled.current) {
      // Auto show banner on all pages except
      // - Board/Card view (if it has been dismissed there)
      // - Gold Promo Free Trial Page (aka "Select A Workspace")
      // - Getting Started Page (after applying free trial)
      if (
        (!isBoardOrCardView || !hasDismissedFromBoardView) &&
        !isFreeTrialPage &&
        !isGettingStartedPage
      ) {
        setIsAutoShow(true);
      } else {
        setIsAutoShow(false);
        if (isGettingStartedPage) {
          refetchBannerQuery();
        }
      }
    }
  }, [
    loading,
    isFreeTrialPage,
    isGettingStartedPage,
    isBoardOrCardView,
    hasDismissedFromBoardView,
    refetchBannerQuery,
  ]);

  return {
    wouldRender:
      !error && !loading && isAutoShow && showGoldPremiumFreeTrialBanner,
    experience: 'goldPremiumFreeTrialExperience',
  };
};
