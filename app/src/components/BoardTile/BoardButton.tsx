import classNames from 'classnames';
import React from 'react';
import styles from './BoardButton.less';

interface BoardButtonProps {
  className?: string;
  icon?: JSX.Element;
  onClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  onKeyDown: React.EventHandler<React.KeyboardEvent<HTMLButtonElement>>;
  tabIndex?: number;
  title: string;
}

export const BoardButton: React.FunctionComponent<BoardButtonProps> = ({
  children,
  className,
  icon,
  onClick,
  onKeyDown,
  tabIndex,
  title,
}) => (
  <button
    className={classNames(styles.button, className)}
    onClick={onClick}
    onKeyDown={onKeyDown}
    tabIndex={tabIndex}
    title={title}
  >
    {icon &&
      React.cloneElement(icon, {
        dangerous_className: children && icon ? styles.iconWithPadding : '',
      })}
    {children}
  </button>
);
