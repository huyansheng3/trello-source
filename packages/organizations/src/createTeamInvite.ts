import { token } from '@trello/session-cookie';
import { clientVersion } from '@trello/config';

export const createTeamInvite = (
  idTeam: string,
  teamName: string,
  teamUrl: string,
): Promise<string> => {
  // The invite post url does not seem to like a standard fetch
  // body and needs the token as form data to create the invite
  // secret correctly
  const requestBody = new FormData();
  requestBody.append('token', token || '');

  return fetch(`/1/organizations/${idTeam}/invitationSecret`, {
    method: 'POST',
    body: requestBody,
    headers: {
      'X-Trello-Client-Version': clientVersion,
    },
  })
    .then((res) => res.json())
    .then((data: { secret: string }) => data.secret)
    .then((secret) =>
      // /:teamName portion of the URL which is captured and
      // replaced with /invite/:teamName/:secret
      teamUrl.replace(/(\/[^/]+$)/, `/invite$1/${secret}`),
    );
};
