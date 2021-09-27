import { memberId } from '@trello/session-cookie';

interface MemberId {
  idMember: string;
}

export const getMemberProperty = (): MemberId | object => {
  // Only append the idMember property if there's a memberId.
  return memberId ? { idMember: memberId } : {};
};
