import { isPremiumTeam } from './isPremiumTeam';
import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

export const freeBoardsRemaining = <Team>(team: Team): number | undefined => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return undefined;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return undefined;
  }

  const delta = limit.disableAt - limit.count;

  return delta < 0 ? 0 : delta;
};
