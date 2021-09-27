import React from 'react';
import { forTemplate } from '@trello/i18n';
import { CanonicalBoardCard } from '@atlassian/trello-canonical-components';
import { LinkWrapper } from 'app/src/components/RouterLink/LinkWrapper';
import { N30 } from '@trello/colors';

const { TeamBoardAndListName } = CanonicalBoardCard;
const format = forTemplate('canonical_card');

export const boardHeaderColor = (
  bottomColor: string | null,
  brightness: string | null,
) => {
  if (bottomColor) {
    return bottomColor;
  }

  return brightness === 'dark' ? '#333' : N30;
};
interface TeamBoardAndListNameProps {
  boardName?: string;
  boardUrl?: string;
  listName: string | null;
  teamName?: string;
  teamUrl?: string;
  onClick?: () => void;
}

export const IntlTeamBoardAndListName = (props: TeamBoardAndListNameProps) => {
  const { teamName, boardName, listName } = props;
  const title = [
    teamName ? `${format('team')}: ${teamName}` : null,
    boardName ? `${format('board')}: ${boardName}` : null,
    listName ? `${format('list')}: ${listName}` : null,
  ]
    .filter((s) => s !== null)
    .join(', ');

  return (
    <TeamBoardAndListName
      title={title}
      linkComponent={LinkWrapper}
      {...props}
    />
  );
};
