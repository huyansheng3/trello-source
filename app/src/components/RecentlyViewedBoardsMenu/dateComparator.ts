interface ItemWithDateLastView {
  dateLastView?: string | null;
}
export const dateComparator = (
  itemA: ItemWithDateLastView,
  itemB: ItemWithDateLastView,
) => {
  if (!itemB.dateLastView || !itemA.dateLastView) return 0;
  return (
    new Date(itemB.dateLastView).getTime() -
    new Date(itemA.dateLastView).getTime()
  );
};
