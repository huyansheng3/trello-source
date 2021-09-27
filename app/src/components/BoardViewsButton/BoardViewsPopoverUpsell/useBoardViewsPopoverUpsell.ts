import { useFeatureFlag } from '@trello/feature-flag-client';
import { useBoardViewsPopoverUpsellQuery } from './BoardViewsPopoverUpsellQuery.generated';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';
import { ProductFeatures } from '@trello/product-features';

const FLAG_NAME = 'nusku.views-switcher-upsell';
const DEFAULT_OPEN_FLAG_NAME = 'nusku.views-switcher-upsell-default-open';
const STANDARD_PREMIUM_FT = 'nusku.repackaging-gtm.standard-premium-trial';

export const useBoardViewsPopoverUpsell = ({ orgId }: { orgId?: string }) => {
  const isFlagEnabled = useFeatureFlag(FLAG_NAME, false, {
    sendExposureEvent: true,
  });
  const isStandardPremiumTrialEnabled = useFeatureFlag(
    STANDARD_PREMIUM_FT,
    false,
  );

  const { data } = useBoardViewsPopoverUpsellQuery({
    variables: {
      orgId: orgId!,
    },
    skip: !orgId,
  });

  const organization = data?.organization;
  const isFreeTeam = Boolean(organization && !organization.products[0]);

  const isStandardTeam = Boolean(
    organization && ProductFeatures.isStandardProduct(organization.products[0]),
  );

  const {
    isEligible: isFreeTrialEligible,
    startFreeTrial,
    isAdmin,
  } = useFreeTrialEligibilityRules(orgId);

  const shouldDisplayFreeTrialStepWithFlag =
    (isStandardTeam || isFreeTeam) && isFreeTrialEligible;

  // Free or Standard team, eligible for Free Trial
  const shouldDisplayFreeTrialStepWithoutFlag =
    !isStandardTeam && isFreeTeam && isFreeTrialEligible;

  const shouldDisplayFreeTrialStep = isStandardPremiumTrialEnabled
    ? shouldDisplayFreeTrialStepWithFlag
    : shouldDisplayFreeTrialStepWithoutFlag;

  // Free or Standard team, not eligible for Free Trial
  const shouldDisplayUpgradeStep =
    (isStandardTeam || isFreeTeam) && !isFreeTrialEligible;

  const step = shouldDisplayFreeTrialStep
    ? 'freetrial'
    : shouldDisplayUpgradeStep
    ? 'upgrade'
    : null;

  const isUpsellEnabled = Boolean(organization && isFlagEnabled && step);

  const isDefaultOpenFlagEnabled = useFeatureFlag(
    DEFAULT_OPEN_FLAG_NAME,
    false,
    {
      sendExposureEvent: true,
    },
  );

  const isUpsellDefaultOpenEnabled = Boolean(
    isDefaultOpenFlagEnabled && isUpsellEnabled,
  );

  return {
    activateFreeTrial: () =>
      startFreeTrial(
        {
          redirect: false,
        },
        'boardViewsInlineDialog',
      ),
    isUpsellEnabled,
    step,
    isAdmin,
    isUpsellDefaultOpenEnabled,
  };
};
