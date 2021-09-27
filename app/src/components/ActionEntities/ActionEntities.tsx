import { forNamespace } from '@trello/i18n';
import { FriendlyLinksRenderer } from 'app/src/components/FriendlyLinksRenderer';
import React from 'react';
import {
  ActionDisplayType,
  ActionEntitiesObject,
  ActionEntityType,
} from './types';
import { ActionDataModel } from 'app/gamma/src/types/models';

import { ActionEntity } from './ActionEntity';
import { EntityTransformers } from './EntityTransformers';
import { formatCustomAction } from './formatCustomAction';
import { isCustomAction } from './customActions';

interface ActionEntitiesProps {
  localeGroup: 'actions' | 'notifications' | 'notificationsGrouped';
  display: ActionDisplayType;
  actionData?: ActionDataModel;
  actionType?: string;
  idAction?: string;
  reactionAdded?: boolean;
  onClick?: (entity: ActionEntityType) => void;
}

export class ActionEntities extends React.Component<
  ActionEntitiesProps,
  ActionDisplayType
> {
  format: ReturnType<typeof forNamespace>;

  constructor(props: ActionEntitiesProps) {
    super(props);
    const { localeGroup, display, actionData, actionType, idAction } = props;

    this.format = isCustomAction({ display })
      ? formatCustomAction
      : // eslint-disable-next-line @trello/strict-translation-arguments
        forNamespace(localeGroup, {
          returnBlankForMissingStrings: true,
        });

    // Some processing has to be done the the entities keys
    // Most of this is to conform with legacy code and code
    // sent from the server, but only if we have entities
    this.state = new EntityTransformers(display)
      .fixDateIssues()
      .fixTranslatebleLocaleGroup(localeGroup)
      .addUrlContext()
      .makeEntitiesFriendly()
      .addActionUrl(actionData, actionType, idAction)
      .checkForTruncation(actionType)
      .value();
  }

  render() {
    const { translationKey, entities } = this.state;

    const formattedEntity = this.format(
      translationKey,
      this.mapEntitiesToComponents(entities),
    );
    if (!formattedEntity) {
      return <span>{this.format('unknown')}</span>;
    }

    return <FriendlyLinksRenderer>{formattedEntity}</FriendlyLinksRenderer>;
  }

  mapEntitiesToComponents = (entities: ActionEntitiesObject = {}) => {
    const mappedEntities: { [type: string]: JSX.Element } = {};
    let i = 0;

    const onClick = this.props.onClick;

    for (const [type, entity] of Object.entries(entities)) {
      mappedEntities[type] = (
        <ActionEntity
          entity={entity}
          reactionAdded={this.props.reactionAdded}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => onClick && onClick(entity)}
          key={i}
        />
      );
      i++;
    }

    return mappedEntities;
  };
}
