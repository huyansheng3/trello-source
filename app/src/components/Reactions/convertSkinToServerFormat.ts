import type { EmojiSkin } from 'emoji-mart';

export const convertSkinToServerFormat = (emojiMartSkin: EmojiSkin | null) => {
  const skinMap = {
    1: null,
    2: '1F3FB',
    3: '1F3FC',
    4: '1F3FD',
    5: '1F3FE',
    6: '1F3FF',
  };

  return skinMap[emojiMartSkin || 1];
};
