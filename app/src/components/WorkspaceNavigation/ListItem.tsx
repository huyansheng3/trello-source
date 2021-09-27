import React, { ReactNode } from 'react';
import classNames from 'classnames';
import RouterLink, {
  RouterLinkProps,
} from 'app/src/components/RouterLink/RouterLink';
import styles from './ListItem.less';

export interface ListItemProps extends RouterLinkProps {
  icon: ReactNode;
  href: string;
  onClick?: () => void;
  secondaryIcon?: ReactNode;
  tooltipText: string;
  active?: boolean;
}

export const ListItem: React.FunctionComponent<ListItemProps> = ({
  icon,
  tooltipText,
  children,
  secondaryIcon,
  active,
  ...rest
}) => {
  return (
    <li>
      <RouterLink
        title={tooltipText}
        className={classNames(styles.linkWrapper, {
          [styles.active]: active,
        })}
        {...rest}
      >
        <div className={styles.iconWrapper}>{icon}</div>
        {children}
        {secondaryIcon ? (
          <div className={styles.secondaryIconWrapper}>{secondaryIcon}</div>
        ) : null}
      </RouterLink>
    </li>
  );
};
