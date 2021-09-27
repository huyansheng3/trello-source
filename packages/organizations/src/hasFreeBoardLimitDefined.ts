export type LimitStatus = 'ok' | 'warn' | 'disabled' | 'maxExceeded';

export interface Limit {
  count?: number;
  disableAt: number;
  status: LimitStatus;
  warnAt: number;
}

export interface OrganizationLimits {
  orgs: {
    freeBoardsPerOrg: Limit;
  };
}

interface MaybeTeamWithLimits {
  limits?: OrganizationLimits;
}

interface TeamWithBoardLimit {
  limits: OrganizationLimits;
}

export const hasFreeBoardLimitDefined = <
  Team extends MaybeTeamWithLimits,
  TeamWithLimits extends TeamWithBoardLimit
>(
  team: Team | TeamWithLimits,
): team is TeamWithLimits => {
  return !!(
    team &&
    team.limits &&
    team.limits.orgs &&
    team.limits.orgs.freeBoardsPerOrg
  );
};
