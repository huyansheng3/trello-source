import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';
import { freeBoardsRemaining } from './freeBoardsRemaining';

export const isCloseToFreeBoardLimit = <Team>(team: Team): boolean => {
  const remaining = freeBoardsRemaining(team);

  if (!hasFreeBoardLimitDefined(team) || remaining === undefined) {
    return remaining !== undefined && remaining <= 7;
  }

  const { disableAt, warnAt } = team.limits.orgs.freeBoardsPerOrg;

  return remaining <= disableAt - warnAt;
};
