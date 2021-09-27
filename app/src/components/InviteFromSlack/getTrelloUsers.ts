import { ApiPromise } from 'app/scripts/network/api-promise';

export const getTrelloUsers = (
  query: string,
  orgId: string,
  idboard: string,
) => {
  return ApiPromise({
    url: '/1/search/members/',
    type: 'get',
    data: {
      query: query,
      idBoard: idboard,
      idOrganization: orgId,
    },
    dataType: 'json',
  });
};
