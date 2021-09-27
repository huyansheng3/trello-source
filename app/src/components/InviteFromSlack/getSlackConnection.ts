import { slackTrelloDomain } from '@trello/config';
import { getVisitorId } from './getVisitorId';
import { Analytics } from '@trello/atlassian-analytics';
import { fetchWithTimeout } from './fetchWithTimeout';

export const getSlackConnection = async (boardId: string, cookie: string) => {
  const visitor = await getVisitorId();
  const queryParams = new URLSearchParams({
    fp: visitor,
    boardId: boardId,
  });
  try {
    const res = await fetchWithTimeout(
      `${slackTrelloDomain}/trello/me/associations?${queryParams}`,
      cookie,
      {
        timeout: 5000,
      },
    );
    if (res?.ok) {
      Analytics.sendTrackEvent({
        action: 'succeeded',
        actionSubject: 'fetchSlackConnection',
        source: 'inviteToBoardInlineDialog',
        attributes: {
          growthInitiative: 'inviteFromSlack',
        },
      });
      return res?.json();
    } else {
      throw res;
    }
  } catch (e) {
    const errorMessage =
      e?.networkError?.message || e?.message || e?.statusText;
    const errorCode = e?.status;
    Analytics.sendTrackEvent({
      action: 'errored',
      actionSubject: 'fetchSlackConnection',
      source: 'inviteToBoardInlineDialog',
      attributes: {
        growthInitiative: 'inviteFromSlack',
        errorMessage,
        errorCode,
      },
    });
    return { associations: false };
  }
};
