import { atlassianApiGateway } from '@trello/config';
import { memberId } from '@trello/session-cookie';
import { useEffect, useState } from 'react';
import { useMemberInfoQuery } from './MemberInfoQuery.generated';

interface UserPersonalizedAttrType {
  name: string;
  value: boolean | string;
}

interface UserPersonalisationResponse {
  attributes: UserPersonalizedAttrType[];
}

const fetchUserPersonalisations = async (
  aaId: string,
): Promise<UserPersonalisationResponse> => {
  try {
    const response = await fetch(
      `${atlassianApiGateway}gateway/api/engage-targeting/api/v3/personalization/user/${aaId}`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Trello-Client-Version': '1.0',
        },
      },
    );

    return response.json();
  } catch (e) {
    return { attributes: [] };
  }
};

export const useAutoProvisioningConfluenceBundled = (skip = false): boolean => {
  const { data } = useMemberInfoQuery({
    variables: { memberId: memberId || 'me' },
  });
  const { aaId } = data?.member || {};

  const [confluenceBundled, setConfluenceBundled] = useState(false);

  useEffect(() => {
    if (skip) return;
    (async () => {
      const { attributes } = await fetchUserPersonalisations(aaId!);

      const confluence = attributes?.find(
        (attr: UserPersonalizedAttrType) =>
          attr.name === 'trello.auto-provision-confluence.site',
      );

      setConfluenceBundled(!!confluence);
    })();
  }, [aaId, skip]);
  return confluenceBundled;
};
