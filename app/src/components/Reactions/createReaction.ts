// Convert the emoji model from EmojiMart into a reaction model
import { ReactionModel } from 'app/gamma/src/types/models';
import { memberId as memberIdFromCookie } from '@trello/session-cookie';
import { normalizeMember } from 'app/gamma/src/api/normalizers/member';
import { BaseEmoji } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';

export const createReaction = (
  emoji: BaseEmoji,
  idAction: string,
  memberId?: string,
): ReactionModel => {
  return {
    id: '',
    idEmoji: emoji.unified,
    idMember: memberId || memberIdFromCookie || '',
    idModel: idAction,
    member: normalizeMember({
      id: memberId || memberIdFromCookie || '',
      enterprises: [],
    }),
    emoji,
  };
};
