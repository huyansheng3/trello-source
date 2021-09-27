import React from 'react';
import { CheckItemEntity } from './types';
import {
  TrelloMarkdown,
  MarkdownContentType,
} from 'app/src/components/TrelloMarkdown';

interface CheckItemProps extends Pick<CheckItemEntity, 'text'> {}

export const CheckItem: React.FunctionComponent<CheckItemProps> = ({
  text,
}) => {
  return (
    <TrelloMarkdown text={text} contentType={MarkdownContentType.CheckItems} />
  );
};
