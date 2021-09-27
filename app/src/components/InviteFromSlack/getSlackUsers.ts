import { slackTrelloDomain } from '@trello/config';
import { fetchWithTimeout } from './fetchWithTimeout';
import { Analytics } from '@trello/atlassian-analytics';

export const getSlackUsers = async (
  searchQuery: string,
  idBoard: string,
  cookie: string,
) => {
  const queryParams = new URLSearchParams({
    q: searchQuery,
    boardId: idBoard,
  });
  const res = await fetchWithTimeout(
    `${slackTrelloDomain}/members/search?${queryParams}`,
    cookie,
    {
      timeout: 15000,
    },
  );
  if (res?.ok) {
    Analytics.sendTrackEvent({
      action: 'succeeded',
      actionSubject: 'fetchSlackUsers',
      source: 'inviteToBoardInlineDialog',
      attributes: {
        growthInitiative: 'inviteFromSlack',
      },
    });
    return res?.json();
  } else {
    throw res;
  }
};
