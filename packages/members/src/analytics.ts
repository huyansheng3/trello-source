import { getPaidStatus } from '@trello/organizations';
import { ProductFeatures } from '@trello/product-features';

export interface Login {
  claimable: boolean;
}

export interface Organization {
  products: number[];
}

export const getAccountType = (logins: Login[]) =>
  logins?.some((login) => login.claimable) ? 'business' : 'personal';

export const getMaxPaidStatus = (
  memberOrgs: Organization[],
  memberProducts: number[],
) => {
  const paidStatusRankings = {
    free: 0,
    standard: 1,
    bc: 2,
    enterprise: 3,
  } as const;

  const maxOrgPaidStatus = memberOrgs.reduce((maxPaidStatus, { products }) => {
    const paidStatus = getPaidStatus(products);
    if (paidStatusRankings[paidStatus] > paidStatusRankings[maxPaidStatus])
      maxPaidStatus = paidStatus;
    return maxPaidStatus;
  }, <'bc' | 'enterprise' | 'free' | 'standard'>'free');

  return maxOrgPaidStatus === 'free'
    ? ProductFeatures.isGoldProduct(memberProducts[0])
      ? 'gold'
      : 'free'
    : maxOrgPaidStatus;
};
