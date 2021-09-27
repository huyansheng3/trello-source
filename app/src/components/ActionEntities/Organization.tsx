import { forTemplate } from '@trello/i18n';
import React from 'react';
import { OrganizationEntity } from './types';
import { siteDomain } from '@trello/config';

const format = forTemplate('entity');

interface OrganizationProps extends Pick<OrganizationEntity, 'text' | 'id'> {}

export const Organization: React.FunctionComponent<OrganizationProps> = ({
  text,
  id,
}) => {
  const organizationUrl = `${siteDomain}/${id}`;

  return <a href={organizationUrl}>{text || format('an-organization')}</a>;
};
