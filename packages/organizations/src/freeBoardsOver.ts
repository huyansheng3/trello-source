import { isPremiumTeam } from './isPremiumTeam';
import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

export const freeBoardsOver = <Team>(team: Team): number => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return 0;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return 0;
  }

  const delta = limit.disableAt - limit.count;

  return delta < 0 ? Math.abs(delta) : 0;
};
