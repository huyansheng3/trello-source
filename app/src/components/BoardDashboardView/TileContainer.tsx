import React, { useMemo } from 'react';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Spinner } from '@trello/nachos/spinner';
import { Button } from '@trello/nachos/button';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import { OverflowMenuHorizontalIcon } from '@trello/nachos/icons/overflow-menu-horizontal';
import { InformationIcon } from '@trello/nachos/icons/information';
import { TileErrorState } from './TileErrorState';
import styles from './TileContainer.less';

interface InfoProps {
  children: React.ReactNode;
}
const Info: React.FC<InfoProps> = ({ children }) => {
  return (
    <Tooltip content={children} tag="span" component={TooltipPrimitiveLight}>
      <InformationIcon size="small" block />
    </Tooltip>
  );
};

interface TileContainerMenuOption {
  name: string;
  onClick(): void;
}

interface TileContainerProps {
  name?: string;
  children: React.ReactNode;
  loading?: boolean;
  menuOptions?: (TileContainerMenuOption | null | undefined)[];
  info?: React.ReactNode;
  error?: Error | null;
}
/**
 * TileContainer represents an individual "tile" on a board report view.
 * It will completely fill the container it is rendered inside of. Whatever space
 * is not used by this generic component itself (title, tooltips, menu, ...) will
 * be used to render its children.
 */
export const TileContainer = ({
  children,
  name,
  menuOptions,
  info,
  loading = false,
  error = null,
}: TileContainerProps) => {
  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>();

  const menuButton = menuOptions ? (
    <Button
      className={styles.menuButton}
      iconBefore={<OverflowMenuHorizontalIcon />}
      type="button"
      ref={triggerRef}
      onClick={toggle}
    />
  ) : null;

  const wrappedMenuOptions = useMemo(() => {
    if (!menuOptions) {
      return [];
    }
    const wrapMenuOptionOnClick = (
      onClick: TileContainerMenuOption['onClick'],
    ) => () => {
      toggle();
      onClick();
    };

    return menuOptions.reduce((acc, curr) => {
      if (curr) {
        acc.push({
          ...curr,
          onClick: wrapMenuOptionOnClick(curr.onClick),
        });
      }
      return acc;
    }, [] as TileContainerMenuOption[]);
  }, [menuOptions, toggle]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <span className={styles.titleLeft}>
            {name && <h4>{name}</h4>}
            {info && <Info key={name}>{info}</Info>}
          </span>
          {wrappedMenuOptions.length > 0 && (
            <span className={styles.titleRight}>{menuButton}</span>
          )}
        </div>
        {loading && <Spinner centered />}
        {error && <TileErrorState />}
        {!loading && !error && (
          <div className={styles.children}>{children}</div>
        )}
      </div>
      <Popover {...popoverProps} size="small">
        <PopoverMenu>
          {wrappedMenuOptions.map((mo) => (
            <PopoverMenuButton key={mo.name} onClick={mo.onClick}>
              {mo.name}
            </PopoverMenuButton>
          ))}
        </PopoverMenu>
      </Popover>
    </div>
  );
};
