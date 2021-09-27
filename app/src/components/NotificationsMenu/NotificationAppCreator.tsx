import React from 'react';

import classNames from 'classnames';

import styles from './NotificationAppCreator.less';
import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { AppCreatorModel } from 'app/gamma/src/types/models';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';

const ICON_NAME_TO_ICON_COMPONENT: Record<string, JSX.Element> = {
  'icon-butler-bot': <ButlerBotIcon color="quiet" size="xsmall" />,
};

export interface NotificationAppCreatorProps {
  appCreator: AppCreatorModel;
  boardId?: string;
  boardUrl?: string;
  cardId?: string;
  type?: string;
}

const format = forTemplate('notification_app_creator');

const trackAppCreatorLinkClicked = (props: NotificationAppCreatorProps) => {
  const { appCreator, boardId, cardId, type } = props;
  Analytics.sendClickedLinkEvent({
    linkName: 'appCreatorLink',
    source: 'notificationsInlineDialog',
    attributes: {
      appCreatorId: appCreator?.id,
      appCreatorIdPlugin: appCreator?.idPlugin,
      actionType: type,
    },
    containers: {
      card: {
        id: cardId,
      },
      board: {
        id: boardId,
      },
    },
  });
};

export const NotificationAppCreator: React.FunctionComponent<NotificationAppCreatorProps> = ({
  appCreator,
  boardId,
  boardUrl,
  cardId,
  type,
}) => {
  const renderNameAndIcon = () => {
    return (
      <>
        {appCreator.iconClass &&
          ICON_NAME_TO_ICON_COMPONENT[appCreator.iconClass] && (
            <span
              className={classNames(
                'app-creator-icon',
                styles.appCreatorIconContainer,
              )}
            >
              {ICON_NAME_TO_ICON_COMPONENT[appCreator.iconClass]}
            </span>
          )}
        <span className="app-creator-name">{appCreator?.name}</span>
      </>
    );
  };

  const hasPluginURL = appCreator.idPlugin && boardUrl && appCreator?.urlSuffix;

  const renderAppCreator = () => {
    return hasPluginURL ? (
      <a
        href={`${String(window.location.origin)}${boardUrl}${
          appCreator?.urlSuffix
        }`}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          trackAppCreatorLinkClicked({ appCreator, boardId, cardId, type });
        }}
        className={classNames('app-creator-link', styles.quiet)}
      >
        {renderNameAndIcon()}
      </a>
    ) : (
      renderNameAndIcon()
    );
  };

  return (
    <span
      className={classNames(
        'notification-app-creator',
        styles.notificationAppCreator,
      )}
    >
      {' '}
      {format('via', {
        integrationName: (
          <React.Fragment key="via-app-creator-integration-name">
            {renderAppCreator()}
          </React.Fragment>
        ),
      })}
    </span>
  );
};
