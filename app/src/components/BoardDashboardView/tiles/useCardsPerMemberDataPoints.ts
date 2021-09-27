import { DataPoint } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import {
  CardsPerMemberCurrentState,
  Member,
} from './useCardsPerMemberCurrentState';

const format = forTemplate('board_report');

type MemberAssignedDataPoint = Member &
  DataPoint & { name: string; kind: 'assigned' };

type MemberUnassignedDataPoint = DataPoint & {
  name: string;
  kind: 'unassigned';
};

export type MemberDataPoint =
  | MemberUnassignedDataPoint
  | MemberAssignedDataPoint;

export const useCardsPerMemberDataPoints = (
  data?: CardsPerMemberCurrentState | null,
) => {
  if (!data) {
    return {};
  }

  const assignedDataPoints: Array<MemberAssignedDataPoint> = Object.values(
    data.assigned,
  ).map((c) => ({
    kind: 'assigned',
    ...c.member,
    name: c.member.fullName ?? c.member.username,
    value: c.count,
  }));

  const unassignedDataPoint: MemberUnassignedDataPoint = {
    kind: 'unassigned',
    name: format('unassigned'),
    value: data.unassigned.count,
  };

  return { assignedDataPoints, unassignedDataPoint };
};
