import { getSlackUsers } from './getSlackUsers';
import { getTrelloUsers } from './getTrelloUsers';
import { Analytics } from '@trello/atlassian-analytics';
import { uniq, union } from 'underscore';
import { SlackSearchToggleHelper } from './SlackSearchToggleHelper';

enum Source {
  SLACK = 'slack',
  TRELLO = 'trello',
}

interface SlackUserProfileProps {
  email: string;
  display_name: string;
  display_name_normalized: string;
  real_name_normalized: string;
  real_name: string;
  image_32: string;
  image_48: string;
}

interface SlackUserResultProps {
  id: string;
  name: string;
  profile: SlackUserProfileProps;
}

interface SlackUsersProps {
  isCacheValid: boolean;
  results: SlackUserResultProps[];
}

interface SlackAvatarsProps {
  image_32: string;
  image_48: string;
}
interface SlackMembersProps {
  email: string;
  username: string;
  source: Source;
  initials: string;
  fullName: string;
  slackAvatars: SlackAvatarsProps;
}

interface TrelloUsersProps {
  active: boolean;
  activityBlocked: boolean;
  avatarHash?: string;
  avatarUrl?: string;
  email?: string;
  fullName: string;
  id: string;
  idBoards: string[];
  idOrganizations: string[];
  initials: string;
  username: string;
  source: Source;
}

const isSlackUserDuplicated = (
  trelloMembers: TrelloUsersProps[],
  slackMember: SlackUserResultProps,
) => {
  trelloMembers.every((trelloMember: TrelloUsersProps) => {
    if (slackMember.profile.email === trelloMember.email) {
      return true;
    }
  });
  return false;
};

export const mergeUsers = (values: [SlackUsersProps, TrelloUsersProps[]]) => {
  const slackArray = values[0]?.results;
  const trelloMembers = values[1];
  const slackMembers: SlackMembersProps[] = [];
  if (slackArray) {
    slackArray.forEach((member: SlackUserResultProps) => {
      if (!isSlackUserDuplicated(trelloMembers, member)) {
        slackMembers.push({
          email: member.profile.email,
          username: member.name,
          source: Source.SLACK,
          initials: member.name.substring(0, 1).toUpperCase(),
          fullName: member.profile.real_name,
          slackAvatars: {
            image_32: member.profile.image_32,
            image_48: member.profile.image_48,
          },
        });
      }
    });
  }
  if (trelloMembers.length !== 0) {
    trelloMembers.forEach((member: TrelloUsersProps) => {
      member.source = Source.TRELLO;
    });
  }
  //@ts-ignore
  const resultArray = slackMembers.concat(trelloMembers);
  return resultArray;
};

export const fetchUsersFromAllSources = (
  query: string,
  orgId: string,
  idboard: string,
  cookie: string,
  shortLink: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredOrgMembers: any,
) => {
  let slackSearchPromise = null;
  if (SlackSearchToggleHelper.isSlackSearchToggledOn(shortLink)) {
    slackSearchPromise = getSlackUsers(query, idboard, cookie);
  }
  const trelloSearchPromise = getTrelloUsers(query, orgId, idboard);
  return Promise.allSettled([slackSearchPromise, trelloSearchPromise]).then(
    (results) => {
      //  Trello Search already handles the error by retrys, thus, here will only handle slack errors.
      results.forEach((result) => {
        if (result.status !== 'fulfilled') {
          // At this point we know it is slack error. Fire Analytics Events
          Analytics.sendTrackEvent({
            action: 'errored',
            actionSubject: 'fetchSlackUsers',
            source: 'inviteToBoardInlineDialog',
            attributes: {
              growthInitiative: 'inviteFromSlack',
              errorMessage: result.reason,
            },
          });
        }
      });
      //@ts-ignore
      const membersData: [SlackUsersProps, TrelloUsersProps[]] = [];
      // We absorb slack error and show Trello users
      results.forEach((result) =>
        //@ts-ignore
        membersData.push(result.value ? result.value : []),
      );
      const mergedUsers = mergeUsers(membersData);
      const uniqueMembers = uniq(
        union(mergedUsers, filteredOrgMembers),
        false,
        (item) => (item.username ? item.username : item.email),
      );
      uniqueMembers.sort((a, b) => a.username.localeCompare(b.username));
      return uniqueMembers;
    },
  );
};
