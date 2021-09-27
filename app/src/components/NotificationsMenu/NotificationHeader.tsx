import React from 'react';

import classNames from 'classnames';

import styles from './NotificationHeader.less';

export enum AspectRatio {
  Square,
  Rectangle,
}

export interface NotificationHeaderProps {
  entity: {
    name: string;
    image?: {
      url: string;
      aspectRatio?: AspectRatio;
    };
    color?: string;
    icon?: React.FunctionComponent;
  };
}

const mapRatioToStyle = (ratio: AspectRatio) => {
  switch (ratio) {
    case AspectRatio.Square:
      return classNames(styles.entityImage, styles.square);
    case AspectRatio.Rectangle:
    default:
      return classNames(styles.entityImage);
  }
};

const NotificationHeaderImage: React.FunctionComponent<{
  url: string;
  aspectRatio?: AspectRatio;
}> = ({ url, aspectRatio = AspectRatio.Rectangle }) => (
  <div className={mapRatioToStyle(aspectRatio)}>
    <img src={url} alt="" />
  </div>
);

const NotificationHeaderColor: React.FunctionComponent<{ color: string }> = ({
  color,
}) => (
  <div className={classNames(styles.entityColor)}>
    <div
      className={classNames(styles.color)}
      style={{ backgroundColor: color }}
    ></div>
  </div>
);

const NotificationHeaderIcon: React.FunctionComponent = ({ children }) => (
  <div className={classNames(styles.entityIcon, styles.square)}>
    <div className={classNames(styles.icon)}>{children}</div>
  </div>
);

export const NotificationHeader: React.FunctionComponent<NotificationHeaderProps> = ({
  entity,
}) => {
  let imageComponent;
  if (entity.image) {
    imageComponent = (
      <NotificationHeaderImage
        url={entity.image.url}
        aspectRatio={entity.image.aspectRatio}
      />
    );
  } else if (entity.color) {
    imageComponent = <NotificationHeaderColor color={entity.color} />;
  } else if (entity.icon) {
    imageComponent = (
      <NotificationHeaderIcon>
        <entity.icon />
      </NotificationHeaderIcon>
    );
  }

  return (
    <div className={classNames(styles.notificationHeader)}>
      {imageComponent}
      <span className={classNames(styles.entityName)}>{entity.name}</span>
    </div>
  );
};
