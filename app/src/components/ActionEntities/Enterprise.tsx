import React from 'react';
import { EnterpriseEntity } from './types';
import { siteDomain } from '@trello/config';

interface EnterpriseProps extends Pick<EnterpriseEntity, 'text' | 'id'> {
  isEnterpriseAdmin?: boolean;
}

export const Enterprise: React.FunctionComponent<EnterpriseProps> = ({
  text,
  id,
  isEnterpriseAdmin = false,
}) => {
  if (isEnterpriseAdmin) {
    const enterpriseUrl = `${siteDomain}/${id}/admin/teams`;

    return <a href={enterpriseUrl}>{text}</a>;
  } else {
    return <span>{text}</span>;
  }
};
