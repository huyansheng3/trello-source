import { isPremiumTeam } from './isPremiumTeam';
import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

export const isFreeBoardLimitOverridden = <Team>(team: Team): boolean => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return false;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;

  return limit.disableAt !== 10;
};
