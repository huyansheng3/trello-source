import { Joinn } from 'app/src/components/Joinn';
import { forNamespace, forTemplate } from '@trello/i18n';
import React from 'react';
import { MemberModel } from 'app/gamma/src/types/models';

import styles from './ReactionTooltip.less';

const formatReactions = forTemplate('reactions');
const format = forNamespace();

/**
 * TooltipContent renders the string "{names} reacted with {colons}."
 */
interface TooltipContentProps {
  isMyReaction: boolean;
  colons?: JSX.Element;
  names: JSX.Element[];
}

const TooltipContent: React.FunctionComponent<TooltipContentProps> = ({
  isMyReaction,
  names,
  colons,
}) => {
  if (!colons) {
    return <Joinn key="names" components={names} />;
  } else if (isMyReaction && names.length === 1) {
    return (
      <>
        {formatReactions('reaction-tooltip-you', {
          name: names[0],
          reaction: colons,
        })}
      </>
    );
  } else if (names.length === 1) {
    return (
      <>
        {formatReactions('reaction-tooltip', {
          name: names[0],
          reaction: colons,
        })}
      </>
    );
  } else if (names.length > 1) {
    return (
      <>
        {formatReactions('reaction-tooltip-plural', {
          names: <Joinn key="names" components={names} />,
          reaction: colons,
        })}
      </>
    );
  } else {
    return colons;
  }
};

/**
 * ReactionsTooltip renders a string like "You, Name2 and Name3 reacted with
 * :joy:"
 */
interface ReactionTooltipProps {
  myId: string;
  colons: string;
  members: MemberModel[];
}

export const ReactionTooltip: React.FunctionComponent<ReactionTooltipProps> = ({
  members,
  colons,
  myId,
}) => {
  const isMyReaction = members.some((member) => member.id === myId);
  const otherMembers = members.filter((member) => member.id !== myId);

  const names = [
    ...(isMyReaction
      ? [<React.Fragment key="me">{format('You')}</React.Fragment>]
      : []),
    ...otherMembers.map((member) => (
      <span className={styles.name} key={member.id}>
        {member.name}
      </span>
    )),
  ];

  return (
    <span className={styles.tooltip}>
      <TooltipContent
        isMyReaction={isMyReaction}
        colons={
          colons ? (
            <span key="colons" className={styles.colons}>
              {colons}
            </span>
          ) : undefined
        }
        names={names}
      />
    </span>
  );
};
