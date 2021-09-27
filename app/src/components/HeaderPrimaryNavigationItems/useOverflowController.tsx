import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { throttle } from 'underscore';
import { MenuItemType } from 'app/src/components/MoreMenu/MoreMenu';

interface OverflowProviderProps {
  children: ReactNode;
  isVisible: boolean;
}

export interface NavigationItem {
  name: MenuItemType;
  component: JSX.Element;
}

// prevent width detector from triggering too many re-renders
const THROTTLE_INTERVAL = 16 * 4;
// approximate min-width of items (based on size of "More" button)
const ITEM_APPROX_MINWIDTH = 77;
const calculateHash = (w: number, n: number) => w + '#' + n;
const updateHashRef = (currentRef: string[], value: string) => {
  currentRef.unshift(value);
  currentRef.length = 3;
};

interface OverflowContextType {
  /**
   * Returns `true` when the navigation item is visible,
   * and `false` when the navigation item has been pushed into the overflow menu.
   */
  isVisible: boolean;
}

const OverflowContext = createContext<OverflowContextType>({
  isVisible: true,
});

export const OverflowProvider = ({
  children,
  isVisible,
}: OverflowProviderProps) => {
  const { Provider } = OverflowContext;
  const value = useMemo(() => ({ isVisible }), [isVisible]);

  return <Provider value={value}>{children}</Provider>;
};

export const useOverflowStatus = () => useContext(OverflowContext);

export const useOverflowController = (navigationItems: NavigationItem[]) => {
  const items = navigationItems.map((item) => item.component);
  const [width, setWidth] = useState(9999);
  const [itemsLimit, setItemsLimit] = useState(items.length);
  const [forceEffectValue, triggerForceEffect] = useState({});
  // Storing items approximate width so we can try expanding when there is enough room
  const itemsWidths = useRef<number[]>([]).current;
  // Storing a couple of width + items count in order to stabilize
  const hashRef = useRef<string[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleSetWidth = useCallback(throttle(setWidth, THROTTLE_INTERVAL), [
    setWidth,
  ]);

  useEffect(() => {
    const lastItemWidth = itemsWidths[itemsLimit];
    const wasJustLimited = lastItemWidth < 0;
    const currentHash = calculateHash(width, itemsLimit);

    if (hashRef.current[0] === currentHash) {
      // After removing an item, if width has not changed yet we schedule a force update
      // to handle case where removing an item does not actually trigger width change
      const timeout = setTimeout(() => {
        updateHashRef(hashRef.current, '');
        triggerForceEffect({});
      }, THROTTLE_INTERVAL * 1.5);
      return () => clearTimeout(timeout);
    }

    if (wasJustLimited) {
      // Width was updated either via resize or after changing the limit
      // we cap the width between ITEM_APPROX_MINWIDTH and 2*ITEM_APPROX_MINWIDTH
      // because width is throttled as when fast expanding/resizing partialWidth
      // will not be reliable (edge case)
      const partialWidth = Math.max(
        Math.min(width + lastItemWidth, ITEM_APPROX_MINWIDTH * 2),
        ITEM_APPROX_MINWIDTH,
      );
      itemsWidths[itemsLimit] = partialWidth;
    }

    if (width < ITEM_APPROX_MINWIDTH * 0.9 && itemsLimit) {
      // If current width is less than an item approx width we remove an item
      // marking the width as negative so we will calculate it on width update
      // plus we set the hash to stabilise and not removing more than one element
      // until we are sure width was updated
      const nextHash = calculateHash(width, itemsLimit - 1);
      if (hashRef.current.indexOf(nextHash) === -1) {
        setItemsLimit(itemsLimit - 1);
        itemsWidths[itemsLimit - 1] = -(width || 1);
        updateHashRef(hashRef.current, nextHash);
      }
      return;
    }

    if (
      width - itemsWidths[itemsLimit] > ITEM_APPROX_MINWIDTH * 1.1 &&
      itemsLimit < items.length
    ) {
      // If we have enough room to accomodate next item width we increase the limit
      // unless it has been recently removed
      const nextHash = calculateHash(width, itemsLimit + 1);
      if (hashRef.current.indexOf(nextHash) === -1) {
        setItemsLimit(itemsLimit + 1);
        updateHashRef(hashRef.current, nextHash);
      }
      return;
    }
  }, [width, hashRef, itemsLimit, itemsWidths, forceEffectValue, items.length]);

  return {
    visibleItems: navigationItems.slice(0, itemsLimit),
    overflowItems: navigationItems.slice(itemsLimit),
    updateWidth: throttleSetWidth,
  };
};
