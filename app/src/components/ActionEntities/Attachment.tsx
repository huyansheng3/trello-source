import React from 'react';
import { AttachmentEntity } from './types';

import { FriendlyLink } from 'app/src/components/FriendlyLinksRenderer/FriendlyLink';
interface AttachmentProps
  extends Pick<
    AttachmentEntity,
    | 'link'
    | 'text'
    | 'id'
    | 'url'
    | 'isFriendly'
    | 'isTrello'
    | 'isTrelloAttachment'
  > {}

// TODO: This thing:
// Get the latest attachment url from the data,
// would mostly likely need handling higher up,
// unless we passed down the data to each entity too
// if entity.type == 'attachment'
//   entity.url = @model.get('data').attachment.url

export class Attachment extends React.PureComponent<AttachmentProps> {
  render() {
    const {
      link,
      text,
      url = '',
      isFriendly,
      isTrello,
      isTrelloAttachment,
    } = this.props;

    if (link || isFriendly) {
      let options = {};
      if (!isTrello && !isTrelloAttachment) {
        // render friendly link
        options = {
          target: '_blank',
          rel: 'noopener noreferrer',
        };
      }

      return (
        <FriendlyLink href={url} {...options}>
          {text}
        </FriendlyLink>
      );
    }

    return <span>{text}</span>;
  }
}
