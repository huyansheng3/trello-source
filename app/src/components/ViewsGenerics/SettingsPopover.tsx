import React from 'react';
import cx from 'classnames';

import { ViewHeaderTestIds } from '@trello/test-ids';

import { Button } from '@trello/nachos/button';
import { usePopover, Popover } from '@trello/nachos/popover';

import styles from './SettingsPopover.less';
interface SettingsPopoverProps {
  popoverChild: React.ReactElement;
  title: string;
  iconBefore: React.ReactElement;
  className: string;
}

export const SettingsPopover: React.FunctionComponent<SettingsPopoverProps> = ({
  title,
  iconBefore,
  className,
  popoverChild,
}) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  return (
    <>
      <Button
        iconBefore={iconBefore}
        className={cx(styles.settings, className)}
        appearance="default"
        onClick={toggle}
        ref={triggerRef}
        children={title}
        data-test-id={ViewHeaderTestIds.SettingsButton}
      />
      <Popover {...popoverProps}>{popoverChild}</Popover>
    </>
  );
};
