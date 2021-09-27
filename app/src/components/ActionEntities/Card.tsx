import React from 'react';
import { CardEntity } from './types';
import { siteDomain } from '@trello/config';

interface CardProps extends Pick<CardEntity, 'text' | 'shortLink' | 'id'> {}

// TODO: Use mose recent card details if available
//    if entity.type == 'card' && (card = ModelCache.get('Card', entity.id))?
//       entity.text = card.get('name')

export const Card: React.FunctionComponent<CardProps> = ({
  text,
  shortLink,
  id,
}) => {
  const cardUrl = `${siteDomain}/c/${shortLink || id}`;

  return (
    <a className="action-card" href={cardUrl}>
      {text}
    </a>
  );
};
