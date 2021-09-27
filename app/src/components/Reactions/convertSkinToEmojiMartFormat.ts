import type { EmojiSkin } from 'emoji-mart';

export const convertSkinToEmojiMartFormat = (serverSkin: string) => {
  const skinMap: { [key: string]: EmojiSkin } = {
    '': 1,
    '1F3FB': 2,
    '1F3FC': 3,
    '1F3FD': 4,
    '1F3FE': 5,
    '1F3FF': 6,
  };

  return skinMap[serverSkin];
};
