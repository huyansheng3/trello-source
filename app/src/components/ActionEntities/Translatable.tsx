import { forNamespace } from '@trello/i18n';
import React from 'react';
import { TranslatableEntity } from './types';
const format = forNamespace('');

interface TranslatableProps
  extends Pick<TranslatableEntity, 'translationKey'> {}

export const Translatable: React.FunctionComponent<TranslatableProps> = ({
  translationKey,
}) => {
  return <span>{format(translationKey)}</span>;
};
