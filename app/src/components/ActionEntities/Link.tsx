import React from 'react';
import { LinkEntity } from './types';
import RouterLink from 'app/src/components/RouterLink/RouterLink';

interface LinkProps extends Pick<LinkEntity, 'url' | 'text'> {}

export const Link: React.FunctionComponent<LinkProps> = ({ url, text }) => {
  return <RouterLink href={url}>{text || url}</RouterLink>;
};
