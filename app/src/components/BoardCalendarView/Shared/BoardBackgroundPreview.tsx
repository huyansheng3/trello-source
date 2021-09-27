import React from 'react';

import { Preview, smallestPreviewBiggerThan } from '@trello/image-previews';
import { Tooltip } from '@trello/nachos/tooltip';

import RouterLink from 'app/src/components/RouterLink/RouterLink';

import styles from './BoardBackgroundPreview.less';

interface BoardBackgroundPreviewProps {
  name?: string;
  url?: string;
  backgroundColor?: string | null;
  backgroundImageScaled?: Preview[] | null;
  backgroundImage?: string | null;
  backgroundTile?: boolean | null;
}

export const BoardBackgroundPreview: React.FC<BoardBackgroundPreviewProps> = ({
  name = '',
  url,
  backgroundColor,
  backgroundImageScaled,
  backgroundImage,
  backgroundTile,
}) => {
  const backgroundStyle: React.CSSProperties = {};

  if (backgroundImageScaled) {
    const image = smallestPreviewBiggerThan(backgroundImageScaled, 12, 42);
    if (image) {
      backgroundStyle.backgroundImage = `url('${image.url}')`;
    }
  }
  if (backgroundImage && backgroundTile) {
    // some old boards have not gone through image scaling,
    // so <board response>.prefs.backgroundImageScaled === null
    backgroundStyle.backgroundImage = `url('${backgroundImage}')`;
  }
  if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  return (
    <RouterLink
      className={styles.backgroundContainer}
      href={url}
      target="_blank"
    >
      <Tooltip content={name} hideTooltipOnMouseDown tag="span" position="top">
        <div className={styles.backgroundImage} style={backgroundStyle} />
      </Tooltip>
    </RouterLink>
  );
};
