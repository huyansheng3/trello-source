import {
  biggestPreview,
  Preview,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';

export interface PotentialCover {
  id: string;
  type: 'attachment' | 'unsplash';
  thumbnailUrl: string;
  edgeColor: string;
  selected: boolean;
}

/**
 * Given all of a card's attachments, getPotentialCovers will return
 * info about the attachments that are valid to set as Card Covers.
 *
 * @param attachments The attachments field on a Card model
 * @returns A list of potential covers for this card
 */
export const getPotentialCovers = (
  attachments: {
    id: string;
    edgeColor?: string | null;
    previews?: Preview[] | null;
  }[] = [],
  idAttachmentCover: string | null,
) => {
  const potentialCovers: PotentialCover[] = [];

  for (const attachment of attachments) {
    const preview =
      smallestPreviewBiggerThan(attachment.previews, 256) ||
      biggestPreview(attachment.previews);

    if (!preview || !preview.url) {
      continue;
    }

    potentialCovers.unshift({
      id: attachment.id,
      type: 'attachment',
      edgeColor: attachment.edgeColor || 'transparent',
      thumbnailUrl: preview.url,
      selected: idAttachmentCover === attachment.id,
    });
  }

  return potentialCovers;
};
