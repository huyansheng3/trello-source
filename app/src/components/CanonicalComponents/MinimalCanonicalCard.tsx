import {
  CanonicalBoardCard,
  CanonicalCard,
} from '@atlassian/trello-canonical-components';
import { forTemplate } from '@trello/i18n';
import {
  boardHeaderColor,
  IntlTeamBoardAndListName,
} from './IntlTeamBoardAndListName';
import React from 'react';
import { formatHumanDate, getStringForCombinedDateBadge } from '@trello/dates';
import { LinkWrapper } from 'app/src/components/RouterLink/LinkWrapper';
import { CardFront } from './CardFront';
import { CardTemplateBadge } from '@atlassian/trello-canonical-components/src/card-front';
import { CardRole } from 'app/gamma/src/types/models';

import styles from './MinimalCanonicalCard.less';

import {
  featureFlagClient,
  seesVersionedVariation,
} from '@trello/feature-flag-client';

const format = forTemplate('canonical_card');

const { Board } = CanonicalBoardCard;
const { CardBadges, CardLink, CardTitle, DueDateBadge } = CanonicalCard;

interface MinimalCanonicalCardProps {
  boardBgBottomColor?: string | null;
  boardBgBrightness?: string | null;
  boardBgColor?: string;
  boardBgImage?: string;
  boardName: string;
  boardUrl: string;
  cardDue?: Date | null;
  cardStart?: Date | null;
  cardDueComplete?: boolean;
  cardIsTemplate?: boolean;
  cardRole?: CardRole | null;
  cardName: string;
  cardUrl: string;
  className?: string;
  isWide?: boolean;
  listName: string;
  onClickCardLink?: () => void;
  onClickBoardName?: () => void;
}

export const MinimalCanonicalCard = ({
  boardBgBottomColor = null,
  boardBgBrightness = null,
  boardBgColor,
  boardBgImage,
  boardName,
  boardUrl,
  cardDue,
  cardStart,
  cardDueComplete,
  cardIsTemplate,
  cardRole,
  cardName,
  cardUrl,
  className,
  isWide,
  listName,
  onClickCardLink,
  onClickBoardName,
}: MinimalCanonicalCardProps) => {
  const shouldSeeCombinedbadges = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  const isLinkCard =
    featureFlagClient.get('wildcard.link-cards', false) && cardRole === 'link';

  return (
    <Board
      bgColor={boardBgColor}
      bgImage={boardBgImage}
      headerBgColor={
        boardBgBottomColor && boardBgBrightness
          ? boardHeaderColor(boardBgBottomColor, boardBgBrightness)
          : null
      }
      widthPx={isWide ? 360 : undefined}
      className={className}
    >
      {isLinkCard ? (
        <CardFront
          className={styles.linkCardFront}
          name={cardName}
          cardRole={cardRole}
        />
      ) : (
        <CardLink
          href={cardUrl}
          onClick={onClickCardLink}
          linkComponent={LinkWrapper}
        >
          <CardTitle>{cardName}</CardTitle>
          {(cardDue || cardStart || cardIsTemplate) && (
            <CardBadges>
              {cardIsTemplate && (
                <CardTemplateBadge>
                  {format('card template badge label')}
                </CardTemplateBadge>
              )}
              {(cardDue || cardStart) && !cardIsTemplate && (
                <DueDateBadge dueDate={cardDue} isComplete={cardDueComplete}>
                  {shouldSeeCombinedbadges &&
                    getStringForCombinedDateBadge(cardStart, cardDue)}
                  {!shouldSeeCombinedbadges &&
                    cardDue &&
                    formatHumanDate(cardDue)}
                </DueDateBadge>
              )}
            </CardBadges>
          )}
        </CardLink>
      )}
      <IntlTeamBoardAndListName
        boardName={boardName}
        boardUrl={boardUrl}
        listName={listName}
        onClick={onClickBoardName}
      />
    </Board>
  );
};
