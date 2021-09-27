import React from 'react';

import { ActionEntityType } from './types';
import { Application } from './Application';
import { Attachment } from './Attachment';
import { AttachmentPreview } from './AttachmentPreview';
import { Board } from './Board';
import { Card } from './Card';
import { CheckItem } from './CheckItem';
import { Comment } from './Comment';
import { Date } from './Date';
import { Enterprise } from './Enterprise';
import { Label } from './Label';
import { Link } from './Link';
import { Member } from './Member';
import { Organization } from './Organization';
import { RelativeDate } from './RelativeDate';
import { Text } from './Text';
import { Translatable } from './Translatable';

const mapEntityToComponent = (entity: ActionEntityType) => {
  if (!entity) {
    return null;
  }

  switch (entity.type) {
    case 'application':
      return Application;
    case 'attachment':
      return Attachment;
    case 'attachmentPreview':
      return AttachmentPreview;
    case 'board':
      return Board;
    case 'card':
      return Card;
    case 'checkItem':
      return CheckItem;
    case 'comment':
      return Comment;
    case 'enterprise':
      return Enterprise;
    case 'date':
      return Date;
    case 'label':
      return Label;
    case 'link':
      return Link;
    case 'member':
      return Member;
    case 'organization':
      return Organization;
    case 'relDate':
      return RelativeDate;
    case 'translatable':
      return Translatable;
    case 'text':
    case 'list':
    case 'checklist':
    case 'plugin':
    case 'customField':
    case 'customFieldItem':
      return Text;
    default:
      console.warn('Unhandled entity, defaulting to text', {
        type: entity.type,
      });
      return Text;
  }
};

interface ActionEntityProps {
  entity: ActionEntityType;
  onClick?: () => void;
  reactionAdded?: boolean;
}

export const ActionEntity: React.FunctionComponent<ActionEntityProps> = ({
  entity,
  reactionAdded,
  onClick,
}) => {
  const EntityComponent = mapEntityToComponent(entity);

  return (
    // @ts-expect-error
    <EntityComponent
      {...entity}
      reactionAdded={reactionAdded}
      onClick={onClick}
    />
  );
};
