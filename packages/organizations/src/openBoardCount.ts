import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

export const openBoardCount = <Team>(team: Team): number | undefined => {
  if (!hasFreeBoardLimitDefined(team)) {
    return undefined;
  }

  return team.limits.orgs.freeBoardsPerOrg.count;
};
