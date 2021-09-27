import React, { useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './HeaderMenu.less';
import type { ActionSubjectIdType } from '@trello/atlassian-analytics';

interface HeaderMenuProps {
  buttonText: string;
  analyticsButtonName: ActionSubjectIdType;
  analyticsComponentName: ActionSubjectIdType;
  popoverTitle: string;
  dataTestId?: string;
  // when shouldHidePopover is true, invoke Nachos Popover's `hide` function
  shouldHidePopover?: boolean;
  // when popover visibility changes from visible to not visible,
  // `resetShouldHidePopover` is invoked if defined
  resetShouldHidePopover?: () => void;
  dangerous_classNamePopover?: string;
  noHorizontalPadding?: boolean;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  buttonText,
  analyticsButtonName,
  analyticsComponentName,
  popoverTitle,
  dataTestId,
  shouldHidePopover,
  resetShouldHidePopover,
  children,
  dangerous_classNamePopover,
  noHorizontalPadding,
}) => {
  const {
    popoverProps,
    triggerRef,
    toggle,
    hide,
  } = usePopover<HTMLButtonElement>();

  const { isVisible: popOverIsVisible } = popoverProps;

  const handleClick = useCallback(() => {
    toggle();
    Analytics.sendClickedButtonEvent({
      buttonName: analyticsButtonName,
      source: 'appHeader',
    });
  }, [toggle, analyticsButtonName]);

  const handleHide = useCallback(() => {
    hide();
    Analytics.sendClosedComponentEvent({
      componentType: 'inlineDialog',
      componentName: analyticsComponentName,
      source: 'appHeader',
    });
  }, [hide, analyticsComponentName]);

  useEffect(() => {
    if (shouldHidePopover) {
      hide();
    }
  }, [shouldHidePopover, hide]);

  useEffect(() => {
    if (!popOverIsVisible) {
      resetShouldHidePopover && resetShouldHidePopover();
    }
  }, [popOverIsVisible, resetShouldHidePopover]);

  return (
    <>
      <Button
        appearance="transparent"
        className={classNames(styles.button, {
          [styles.buttonOpen]: popOverIsVisible,
        })}
        data-test-id={dataTestId}
        title={buttonText}
        // set aria label so screen reader doesn't read out the down icon
        aria-label={popoverTitle}
        onClick={handleClick}
        ref={triggerRef}
        iconAfter={
          <DownIcon
            size="small"
            color="light"
            dangerous_className={styles.buttonIcon}
          />
        }
        // onFocus / onBlur - do not define these until the bug in Nachos Button is fixed so that focus outlines work
      >
        <span className={styles.buttonText}>{buttonText}</span>
      </Button>
      <Popover
        {...popoverProps}
        title={popoverTitle}
        onHide={handleHide}
        dangerous_className={dangerous_classNamePopover}
        noHorizontalPadding={noHorizontalPadding}
      >
        {children}
      </Popover>
    </>
  );
};
