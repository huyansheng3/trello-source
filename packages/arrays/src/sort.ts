// Keys of a type T with values that can be assigned to something of type U
// For example,
// KeysWithType<{a:string, b?:string, c:number}, string> returns 'a'
// KeysWithType<{a:string, b:string, c:number}, string> returns 'a' | 'b'
type KeysWithType<T, U> = {
  [K in keyof T]-?: T[K] extends U ? K : never;
}[keyof T];

export const byAttributeCaseInsensitive = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Model extends { [key: string]: any },
  Attr extends KeysWithType<Model, string | undefined>
>(
  attr: Attr,
) => (a: Model, b: Model) => {
  if (!a[attr] || !b[attr]) {
    return 0;
  }
  const aValue = a[attr].toLocaleLowerCase();
  const bValue = b[attr].toLocaleLowerCase();

  return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
};
