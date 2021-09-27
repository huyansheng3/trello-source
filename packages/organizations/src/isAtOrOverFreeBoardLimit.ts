import { freeBoardsRemaining } from './freeBoardsRemaining';

export const isAtOrOverFreeBoardLimit = <Team>(team: Team): boolean => {
  const remaining = freeBoardsRemaining(team);

  return remaining === 0;
};
