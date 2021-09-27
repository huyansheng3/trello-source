import { useAutoRenewalQuery } from './UpgradePopover/AutoRenewalQuery.generated';
import { BillingDates, ProductFeatures } from '@trello/product-features';
import { sendErrorEvent } from '@trello/error-reporting';
import { deserializeJSONString } from '@trello/graphql';

interface StandardPremiumFreeTrialObj {
  loading: boolean;
  isStandardPremiumFreeTrialActive: boolean;
  isAutoUpgrade: boolean;
  billingDates?: BillingDates;
  currentProduct?: number;
  freeTrialProduct?: number;
  prevSubscriptionCancelledDate?: string;
  prevSubscriptionProduct?: number;
  freeTrialEndDate?: string;
  freeTrialStartDate?: string;
  canRenewCurrentSubscription?: boolean;
}

/**
 * Checks if a standard workspace has premium ft and auto upgradable data.
 * Non-Standard workspaces will return false for premium ft and auto upgrade.
 */
export const useStandardPremiumFreeTrial = (
  accountId: string,
): StandardPremiumFreeTrialObj => {
  const { data, loading, error } = useAutoRenewalQuery({
    variables: {
      orgId: accountId,
    },
    skip: !accountId,
  });
  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-nusku' },
    });

  const org = data?.organization;
  const paidAcct = org?.paidAccount;

  const productOverride = paidAcct?.productOverride;

  // Free workspaces with FT don't have the productOverride Object so they aren't eligible for auto upgrades
  if (!productOverride || !data) {
    return {
      loading,
      isAutoUpgrade: false,
      isStandardPremiumFreeTrialActive: false,
    };
  }

  const {
    product: freeTrialProduct,
    dateStart: freeTrialStartDate,
    dateEnd: freeTrialEndDate,
    autoUpgrade: isAutoUpgrade,
  } = productOverride;

  const currentProduct = paidAcct?.paidProduct;
  const canRenewCurrentSubscription = paidAcct?.canRenew;
  const isStandardPremiumFreeTrialActive =
    ProductFeatures.isStandardProduct(currentProduct) &&
    ProductFeatures.isBusinessClassProduct(freeTrialProduct);

  const prevSubscriptionCancelledDate =
    paidAcct?.previousSubscription?.dtCancelled;
  const prevSubscriptionProduct =
    paidAcct?.previousSubscription?.ixSubscriptionProductId;

  const billingDates =
    deserializeJSONString<BillingDates>(paidAcct?.billingDates) ?? {};

  return {
    loading,
    billingDates,
    currentProduct,
    prevSubscriptionCancelledDate,
    prevSubscriptionProduct,
    canRenewCurrentSubscription,
    freeTrialProduct,
    freeTrialEndDate,
    freeTrialStartDate,
    isAutoUpgrade,
    isStandardPremiumFreeTrialActive,
  };
};
