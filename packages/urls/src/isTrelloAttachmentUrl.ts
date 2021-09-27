import { attachmentsDomain } from '@trello/config';
import { isTrelloUrl } from './isTrelloUrl';

export const isTrelloAttachmentUrl = (url: string): boolean => {
  if (url.indexOf(attachmentsDomain) === 0) {
    return true;
  }
  try {
    return (
      !!new URL(url).pathname.match(
        /^\/1\/cards\/[a-f0-9]{24}\/attachments\/[a-f0-9]{24}\/download\/.*/,
      ) && isTrelloUrl(url)
    );
  } catch (e) {
    return false;
  }
};
