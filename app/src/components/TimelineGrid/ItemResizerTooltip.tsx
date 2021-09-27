import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import React, { useRef, useCallback } from 'react';
import styles from './ItemResizerTooltip.less';

interface ItemResizeTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const ItemResizerTooltip: React.FunctionComponent<ItemResizeTooltipProps> = ({
  content,
  children,
}) => {
  const targetRef = useRef<HTMLElement>(null);
  const setRef = useCallback((node: HTMLElement | null) => {
    if (node && node.firstChild) {
      // @ts-expect-error - React Ref typing is too strict for this use case
      targetRef.current = node.firstChild;
    }
  }, []);

  const calculateRenderLocation = () => {
    const coordinates = targetRef.current?.getBoundingClientRect();
    if (coordinates) {
      const targetHeight = targetRef.current?.offsetHeight || 0;
      const targetWidth = targetRef.current?.offsetWidth || 0;
      return {
        x: coordinates.x + targetWidth / 2,
        y: coordinates.y - targetHeight * 1.3,
      };
    }
    return { x: 0, y: 0 };
  };

  const getTooltipStyle = () => {
    const { x, y } = calculateRenderLocation();
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      transform: `translate3d(calc(-50% + ${x}px), ${y}px, 0px)`,
    } as React.CSSProperties;
  };

  return (
    <>
      <div className={styles.itemResizerHandleWrapper} ref={setRef}>
        {children}
      </div>
      <Portal zIndex={5}>
        <Popper
          placement="top"
          referenceElement={targetRef.current || undefined}
        >
          {() => (
            <div className={styles.tooltipWrapper} style={getTooltipStyle()}>
              {content}
            </div>
          )}
        </Popper>
      </Portal>
    </>
  );
};
