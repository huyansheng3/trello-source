import { isHighDPI } from '@trello/browser';
import classNames from 'classnames';
import {
  biggestPreview,
  Preview,
  smallestPreviewBiggerThan,
  makePreviewCachable,
} from '@trello/image-previews';
import React from 'react';
import { AttachmentPreviewEntity } from './types';

import styles from './AttachmentPreview.less';

// TODO: Get data from the card for the rendering
// TODO: Attachment viewer integration

interface AttachmentPreviewProps
  extends Pick<
    AttachmentPreviewEntity,
    'originalUrl' | 'id' | 'previewUrl' | 'previewUrl2x'
  > {
  showCompactAttachmentPreview?: boolean;
  previews?: Preview[];
}

const getPreviewUrlForRes = ({
  previewUrl,
  previewUrl2x,
  previews,
}: {
  previewUrl?: string;
  previewUrl2x?: string;
  previews: Preview[];
}) => {
  let previewUrlForRes;

  if (previews) {
    const getBiggestPreview = biggestPreview(previews);
    if (isHighDPI()) {
      previewUrlForRes =
        smallestPreviewBiggerThan(previews, 1000) || getBiggestPreview;
    } else {
      previewUrlForRes =
        smallestPreviewBiggerThan(previews, 500) || getBiggestPreview;
    }
    if (previewUrlForRes) {
      previewUrlForRes = previewUrlForRes.url;
    }
  }

  if (!previewUrlForRes && previewUrl) {
    if (isHighDPI() && previewUrl2x) {
      previewUrlForRes = previewUrl2x;
    } else {
      previewUrlForRes = previewUrl;
    }
  }

  if (typeof previewUrlForRes === 'string') {
    return makePreviewCachable(previewUrlForRes);
  }

  return previewUrlForRes;
};

export class AttachmentPreview extends React.Component<AttachmentPreviewProps> {
  onClickAttachmentPreview = (e: React.MouseEvent<HTMLElement>) => {
    const { showCompactAttachmentPreview = false } = this.props;

    if (showCompactAttachmentPreview) {
      this.openCard();
    } else {
      this.openAttachmentViewer();
    }

    e.preventDefault();
  };

  openAttachmentViewer() {}

  openCard() {}

  render() {
    const {
      originalUrl,
      previewUrl,
      previewUrl2x,
      showCompactAttachmentPreview,
      previews = [],
    } = this.props;

    const previewUrlForRes = getPreviewUrlForRes({
      previewUrl,
      previewUrl2x,
      previews,
    });

    if (previewUrlForRes) {
      const previewClasses = {
        [styles.attachmentImagePreview]: true,
        [styles.modCompactImagePreview]: showCompactAttachmentPreview,
      };

      return (
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={this.onClickAttachmentPreview}
        >
          <img
            className={classNames(previewClasses)}
            src={previewUrlForRes}
            alt="Attachment Preview"
          />
        </a>
      );
    }

    return null;
  }
}
