import { useFreeTrialEligibilityRulesQuery } from './FreeTrialEligibilityRulesQuery.generated';
import { useAddFreeTrialCreditMutation } from 'app/src/components/UpgradePrompts/AddFreeTrialCreditMutation.generated';
import TeamBillingStatementsQuery from 'app/src/components/BillingDetails/BillingHistory/TeamBillingStatementsQuery.graphql';
import MoonshotOrganizationQuery from 'app/src/components/Moonshot/MoonshotOrganizationQuery.graphql';
import { getFreeTrialProperties, TrialSource } from '@trello/organizations';
import { isActive, needsCC } from '@trello/paid-account';
import { navigate } from 'app/scripts/controller/navigate';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { getNetworkError } from '@trello/graphql-error-handling';
import Alerts from 'app/scripts/views/lib/alerts';
import { idToDate } from '@trello/dates';
import moment from 'moment';
import { ProductFeatures } from '@trello/product-features';
import { isCompletelyFreeTrial } from 'app/src/components/Moonshot/experimentVariation';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useGoldPromoFreeTrialEligibilityQuery } from './GoldPromoFreeTrialEligibilityQuery.generated';
import { useGoldPromoAddFreeTrialMutation } from './GoldPromoAddFreeTrialMutation.generated';
import { showFlag } from '@trello/nachos/experimental-flags';

export interface StartFreeTrialOptions {
  redirect?: boolean;
  count?: number;
}

export interface FreeTrialRules {
  isAdmin: boolean;
  hasCredit: boolean;
  isTrialActive?: boolean;
  isExpired?: boolean;
  isEligible?: boolean;
  isStandard: boolean;
  isPremium: boolean;
  isEnterpriseMember: boolean;
  loading: boolean;
  daysLeft: number;
  trialSource?: TrialSource;
  startDate?: Date;
  days?: number;
  startFreeTrial: (
    options?: StartFreeTrialOptions,
    source?: SourceType,
  ) => Promise<void>;
  addingTrial: boolean;
  endDate: Date | null;
  totalFreeTrialCredits: number;
  hasOverTenOpenBoards: boolean;
}

export const useFreeTrialEligibilityRules = (
  orgId?: string,
  options: { skip: boolean } = { skip: false },
): FreeTrialRules => {
  const standardPremiumFreeTrialEnabled = useFeatureFlag(
    'nusku.repackaging-gtm.standard-premium-trial',
    false,
  );

  const { data, loading } = useFreeTrialEligibilityRulesQuery({
    variables: {
      orgId: orgId || '',
    },
    skip: !orgId || options.skip,
  });
  const [
    addFreeTrialCredit,
    { loading: addingTrial },
  ] = useAddFreeTrialCreditMutation();

  const member = data?.member;
  const organization = data?.organization;
  const memberId = member?.id || '';
  const products = organization?.products || [];
  const isStandard = Boolean(
    organization?.premiumFeatures?.includes('isStandard'),
  );
  const isPremium = Boolean(
    organization?.premiumFeatures?.includes('isPremium'),
  );
  const isEnterpriseMember = !!member?.enterprises?.find(
    (ent) => ent.id === member?.idEnterprise,
  )?.isRealEnterprise;
  const isConfirmed = member?.confirmed;
  const orgName = organization?.name;
  const credits = organization?.credits || [];
  const isDisabled = needsCC(organization?.paidAccount?.standing);
  const trialProperties = getFreeTrialProperties(
    credits,
    products,
    data?.organization?.paidAccount?.trialExpiration || '',
  );
  const hasCredit = !!trialProperties?.credit;
  const hasNewCredit = credits.some(
    (credit) =>
      credit.type === 'freeTrial' &&
      // ignore free trials that expired before 2/9/2021
      moment(idToDate(credit.id))
        .add(credit.count, 'day')
        .isAfter('2021-02-09T00:00:00+0000'),
  );
  const totalFreeTrialCredits = credits.filter(
    (credit) => credit.type === 'freeTrial',
  ).length;
  const isAdmin = !!organization?.memberships.find(
    (member) => member.idMember === memberId && member.memberType === 'admin',
  );
  const hasOverTenOpenBoards = (organization?.boards?.length || 0) > 10;

  const startFreeTrial = async (
    { redirect, count }: StartFreeTrialOptions = { redirect: true },
    source?: SourceType,
  ) => {
    if (!orgId || loading || hasNewCredit || addingTrial) {
      return;
    }

    try {
      await addFreeTrialCredit({
        variables: {
          orgId,
          ...(count ? { count } : {}),
        },
        refetchQueries: [
          {
            query: TeamBillingStatementsQuery,
            variables: {
              orgId,
            },
          },
          ...(isCompletelyFreeTrial()
            ? [
                {
                  query: MoonshotOrganizationQuery,
                  variables: {
                    orgId,
                  },
                },
              ]
            : []),
        ],
      });
      if (source)
        Analytics.sendTrackEvent({
          action: 'accepted',
          actionSubject: 'freeTrial',
          source,
          containers: {
            organization: {
              id: orgId,
            },
          },
        });
    } catch (e) {
      Alerts.showLiteralText(e, 'error', 'useFreeTrialEligibilityRules', 5000);
      const networkError = getNetworkError(e);
      if (source)
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'freeTrial',
          source,
          attributes: {
            errorMessage: networkError?.message ?? e?.message,
            errorCode: networkError?.code,
          },
        });
    }

    if (redirect) {
      navigate(`/${orgName}/getting-started`, {
        trigger: true,
        replace: true,
      });
    }
  };

  // TODO: repackaging gtm cleanup
  // If repackaging flag is not on, Standard is not eligible for free trials. Otherwise, no need to check for Standard
  const isStandardBasedOnFlag = !standardPremiumFreeTrialEnabled
    ? !isStandard
    : true;

  return {
    startFreeTrial,
    addingTrial,
    isAdmin,
    hasCredit,
    isTrialActive: trialProperties?.isActive,
    isExpired: trialProperties?.isExpired,
    isEligible:
      isAdmin &&
      !hasNewCredit &&
      !isDisabled &&
      isConfirmed &&
      !isEnterpriseMember &&
      !isPremium &&
      isStandardBasedOnFlag,
    loading,
    isStandard,
    isPremium,
    isEnterpriseMember,
    daysLeft: trialProperties?.daysLeft || 0,
    trialSource: trialProperties?.trialSource,
    startDate: trialProperties?.startDate,
    days: trialProperties?.days,
    endDate: trialProperties?.expiresAt ?? null,
    totalFreeTrialCredits,
    hasOverTenOpenBoards,
  };
};

// TODO: rethink the original useFreeTrialEligibilityRules implementation
// to account for checks in multiple teams
export const GTM_LAUNCH_DATE = new Date('8/24/2021');
export const useMyGoldPromoFreeTrial = () => {
  const isStandardPremiumTrialEnabled = useFeatureFlag(
    'nusku.repackaging-gtm.standard-premium-trial',
    false,
  );
  const { data, loading } = useGoldPromoFreeTrialEligibilityQuery({
    variables: { memberId: 'me' },
  });
  const [
    addFreeTrial,
    { loading: addingTrial },
  ] = useGoldPromoAddFreeTrialMutation();
  const member = data?.member;
  const myId = member?.id;

  const isConfirmedMember = Boolean(member?.confirmed);

  const isEnterpriseMember = Boolean(
    member?.enterprises?.find((ent) => ent.id === member?.idEnterprise)
      ?.isRealEnterprise,
  );

  const workspaces = data?.member?.organizations || [];

  const goldSunsetFreeTrialIdOrganization =
    member?.goldSunsetFreeTrialIdOrganization;

  const activatedGoldPromo = Boolean(goldSunsetFreeTrialIdOrganization);

  const activatedGoldPromoTeamName = activatedGoldPromo
    ? workspaces.find(
        (workspace) => workspace.id === goldSunsetFreeTrialIdOrganization,
      )?.name || goldSunsetFreeTrialIdOrganization
    : '';

  const products = member?.paidAccount?.products || [];
  const standing = member?.paidAccount?.standing || -1;
  const isPaidGold = isActive({ products, standing });

  const hasPersonalBoards = member?.boards?.some(
    ({ enterpriseOwned, idOrganization, memberships }) =>
      !idOrganization &&
      !enterpriseOwned &&
      // is member an admin on the board
      memberships.some(
        ({ idMember, memberType }) =>
          idMember === member.id && memberType === 'admin',
      ),
  );

  const gtmDate = GTM_LAUNCH_DATE.toISOString();

  const {
    ixSubscriptionProductId: cancelledProduct,
    dtCancelled: cancelledDate,
  } = data?.member?.paidAccount?.previousSubscription ?? {};

  const goldIsCancelledPostGTM = Boolean(
    cancelledProduct &&
      ProductFeatures.isGoldProduct(cancelledProduct) &&
      moment(cancelledDate)?.isAfter(gtmDate, 'day'),
  );

  const isEligibleMember =
    isConfirmedMember &&
    (isPaidGold || goldIsCancelledPostGTM) &&
    !hasPersonalBoards &&
    !isEnterpriseMember &&
    !activatedGoldPromo;

  const eligibleWorkspaces = workspaces.filter((workspace) => {
    // Is current member admin of the workspace
    const isAdmin = workspace.memberships.some(
      ({ idMember, memberType }) => idMember === myId && memberType === 'admin',
    );

    // Is workspace disabled Standing === 5
    const isDisabled = needsCC(workspace.paidAccount?.standing);

    // Does the workspace have credits after 2/9/2021
    const hasNewCredit = (workspace?.credits || []).some(
      (credit) =>
        credit.type === 'freeTrial' &&
        // ignore free trials that expired before 2/9/2021
        moment(idToDate(credit.id))
          .add(credit.count, 'day')
          .isAfter('2021-02-09T00:00:00+0000'),
    );

    const isPremiumWorkspace = workspace.premiumFeatures.includes('isPremium');
    const isStandardWorkspace = workspace.premiumFeatures.includes(
      'isStandard',
    );
    const isFreeWorkspace = !isPremiumWorkspace && !isStandardWorkspace;

    const isFreeOrStandardEligibleForTrial =
      isFreeWorkspace || (isStandardWorkspace && isStandardPremiumTrialEnabled);

    return (
      isAdmin &&
      !isDisabled &&
      !hasNewCredit &&
      !isPremiumWorkspace &&
      isFreeOrStandardEligibleForTrial
    );
  });

  const startGoldFreeTrial = async ({
    orgId,
    orgName,
  }: {
    orgId: string;
    orgName: string;
  }) => {
    if (!orgId || loading || addingTrial) {
      return;
    }

    try {
      await addFreeTrial({
        variables: {
          orgId,
          count: 60,
          via: 'gold',
        },
      });

      Analytics.sendTrackEvent({
        action: 'accepted',
        actionSubject: 'freeTrial',
        source: 'goldPromoFreeTrialRoute',
        containers: {
          organization: {
            id: orgId,
          },
        },
      });
    } catch (e) {
      const networkError = getNetworkError(e);

      showFlag({
        id: 'goldPromoAddFreeTrialError',
        title: networkError?.message,
        appearance: 'error',
      });

      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'freeTrial',
        source: 'goldPromoFreeTrialRoute',
        attributes: {
          errorMessage: networkError?.message ?? e?.message,
          errorCode: networkError?.code,
        },
      });
    }

    if (orgName) {
      navigate(`/${orgName}/getting-started`, {
        trigger: true,
        replace: true,
      });
    }
  };

  return {
    addingTrial,
    eligibleWorkspaces,
    activatedGoldPromo,
    activatedGoldPromoTeamName,
    isEligibleMember,
    loading,
    startGoldFreeTrial,
  };
};
