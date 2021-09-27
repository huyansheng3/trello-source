import { LabelColor, LabelModel } from 'app/gamma/src/types/models';

const ColorOrder = new Map<LabelColor | null, number>([
  [LabelColor.Green, 0],
  [LabelColor.Yellow, 1],
  [LabelColor.Orange, 2],
  [LabelColor.Red, 3],
  [LabelColor.Purple, 4],
  [LabelColor.Blue, 5],
  [LabelColor.Sky, 6],
  [LabelColor.Lime, 7],
  [LabelColor.Pink, 8],
  [LabelColor.Black, 9],
  [null, 999],
]);

export const labelByColor = (
  { color: a }: LabelModel,
  { color: b }: LabelModel,
) => {
  const enumCompare = ColorOrder.get(a)! - ColorOrder.get(b)!;
  const nameCompare = (a || '').toLowerCase().localeCompare(b || '');

  return !ColorOrder.has(a) || !ColorOrder.has(b) ? nameCompare : enumCompare;
};
