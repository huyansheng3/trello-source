import { isPremiumTeam } from './isPremiumTeam';
import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

export const freeBoardsUsed = <Team>(team: Team): number | undefined => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return undefined;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return undefined;
  }

  return limit.count;
};
