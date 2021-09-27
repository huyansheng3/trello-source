import { NotificationTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { forNamespace } from '@trello/i18n';
import { Tooltip } from '@trello/nachos/tooltip';
import React from 'react';

import styles from './NotificationToggleReadButton.less';

const format = forNamespace('notification');

interface DispatchProps {
  onMouseEnter?: (toolTipName: symbol) => void;
  onMouseLeave?: () => void;
}

interface NotificationToggleReadButtonProps extends DispatchProps {
  onClick?: () => void;
  markRead?: boolean;
  className?: string;
  testId?: NotificationTestIds;
}

export const NotificationToggleReadButton: React.FunctionComponent<NotificationToggleReadButtonProps> = ({
  markRead = false,
  onClick,
  className,
}) => {
  return (
    <Tooltip
      content={<div>{format(markRead ? 'mark read' : 'mark unread')}</div>}
    >
      <button
        className={classNames(
          styles.notificationToggleReadButton,
          {
            [styles.markRead]: markRead,
          },
          className,
        )}
        onClick={onClick}
        data-test-id={
          markRead
            ? NotificationTestIds.ToggleReadButton
            : NotificationTestIds.ToggleUnreadButton
        }
      />
    </Tooltip>
  );
};
