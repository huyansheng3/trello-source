import React from 'react';
import { BoardEntity } from './types';
import { siteDomain } from '@trello/config';

interface BoardProps extends Pick<BoardEntity, 'text' | 'shortLink' | 'id'> {}

export const Board: React.FunctionComponent<BoardProps> = ({
  text,
  shortLink,
  id,
}) => {
  const boardUrl = `${siteDomain}/b/${shortLink || id}`;

  return <a href={boardUrl}>{text}</a>;
};
