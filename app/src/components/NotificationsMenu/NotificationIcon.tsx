import React from 'react';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';
import { DownloadIcon } from '@trello/nachos/icons/download';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { RefreshIcon } from '@trello/nachos/icons/refresh';
import { CloseIcon } from '@trello/nachos/icons/close';
import { MemberIcon } from '@trello/nachos/icons/member';
import { CommentIcon } from '@trello/nachos/icons/comment';
import { ForwardIcon } from '@trello/nachos/icons/forward';
import { ArchiveIcon } from '@trello/nachos/icons/archive';
import { RemoveMemberIcon } from '@trello/nachos/icons/remove-member';
import { AddMemberIcon } from '@trello/nachos/icons/add-member';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { AttachmentIcon } from '@trello/nachos/icons/attachment';

import RouterLink from 'app/src/components/RouterLink/RouterLink';

import classNames from 'classnames';
import styles from './NotificationIcon.less';

interface NotificationIconProps {
  // The icon key is the translationKey from the entities object
  iconKey?: string;
  icon?: JSX.Element;
  url?: string;
  className?: string;
  onClick?: () => void;
}

const convertIconKeyToCustomActionIcon = (
  iconKey: string,
): JSX.Element | null => {
  const k = iconKey.replace('custom_action_', '');
  if (k.startsWith('butler_')) {
    if (k === 'butler_quota_exceeded_organization_supplement') {
      return <EnterpriseIcon />;
    }
    return <ButlerBotIcon />;
  }
  if (k.startsWith('export_')) {
    return <DownloadIcon />;
  }
  return null;
};

const convertIconKeyToIcon = (iconKey: string): JSX.Element | null => {
  switch (iconKey.replace('notification_', '')) {
    case 'added_attachment_to_card':
      return <AttachmentIcon />;
    case 'added_a_due_date':
    case 'changed_due_date':
    case 'is_due':
    case 'card_due_soon':
    case 'was_due':
    case 'removed_due_date':
      return <ClockIcon />;
    case 'added_to_card':
    case 'added_to_organization':
    case 'added_to_board':
      return <AddMemberIcon />;
    case 'removed_from_board':
    case 'removed_from_card':
    case 'removed_from_organization':
      return <RemoveMemberIcon />;
    case 'archived_card':
    case 'unarchived_card':
      return <ArchiveIcon />;
    case 'moved_card':
    case 'created_card':
      return <ForwardIcon />;
    case 'comment_card':
    case 'mentioned_on_card':
      return <CommentIcon />;
    case 'made_admin_of_board':
    case 'made_admin_of_organization':
      return <MemberIcon />;
    case 'close_board':
      return <CloseIcon />;
    case 'reopen_board':
      return <RefreshIcon />;
    case 'reacted_to_comment':
      return null;
    default: {
      const customActionIcon = convertIconKeyToCustomActionIcon(iconKey);
      if (customActionIcon) {
        return customActionIcon;
      }
      return <MemberIcon />;
    }
  }
};

export const hasIcon = (iconKey: string): boolean => {
  return convertIconKeyToIcon(iconKey) !== null;
};

const isSupplementIcon = (iconKey: string | undefined): boolean => {
  return !!iconKey?.endsWith('supplement');
};

export const NotificationIcon: React.FunctionComponent<NotificationIconProps> = ({
  icon,
  iconKey,
  url,
  className,
  onClick,
}) => {
  let renderedIcon: JSX.Element | null = icon || null;

  if (!renderedIcon && iconKey) {
    renderedIcon = convertIconKeyToIcon(iconKey);
  }

  if (!renderedIcon) {
    return null;
  }

  const iconClasses = {
    [styles.notificationIcon]: true,
    [styles.notificationIconLink]: typeof url !== 'undefined',
    [styles.supplementNotificationIcon]: isSupplementIcon(iconKey),
  };
  const iconComponent = React.cloneElement(renderedIcon, {
    size: 'small',
  });

  return (
    <div
      className={classNames(iconClasses, className)}
      onClick={onClick}
      role="button"
    >
      {url ? (
        <RouterLink href={url}>{iconComponent}</RouterLink>
      ) : (
        iconComponent
      )}
    </div>
  );
};
