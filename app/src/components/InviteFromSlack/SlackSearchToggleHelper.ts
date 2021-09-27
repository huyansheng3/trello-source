import { memberId } from '@trello/session-cookie';
import { TrelloStorage } from '@trello/storage';

export const SlackSearchToggleHelper = {
  isSlackSearchToggledOn: (shortLink: string | undefined) => {
    if (!shortLink) return true;
    const isSlackSearchToggledOnKey =
      'slack-search-toggled-on-' + memberId + '-' + shortLink;
    const value = TrelloStorage.get(isSlackSearchToggledOnKey);
    return value !== 'false';
  },
  setSlackSearchToggle: (shortLink: string | undefined, value: boolean) => {
    if (!shortLink) return;
    const isSlackSearchToggledOnKey =
      'slack-search-toggled-on-' + memberId + '-' + shortLink;
    TrelloStorage.set(isSlackSearchToggledOnKey, value.toString());
  },
};
