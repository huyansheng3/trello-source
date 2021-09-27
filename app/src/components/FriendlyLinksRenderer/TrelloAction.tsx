import React, { useEffect, useCallback, FunctionComponent } from 'react';
import { omit } from 'underscore';

import { truncate } from '@trello/strings';
import { EntityTransformers } from 'app/src/components/ActionEntities/EntityTransformers';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { markdown } from 'app/src/components/TrelloMarkdown';
import { loadAction } from 'app/gamma/src/modules/loaders/load-actions';
import { State } from 'app/gamma/src/modules/types';
import { useSelector, useDispatch } from 'react-redux';
import { getActionById } from 'app/gamma/src/selectors/actions';
import { ActionModel } from 'app/gamma/src/types/models';

const isCommentLike = ({ type }: { type?: string }): boolean => {
  if (!type) {
    return false;
  }

  return type === 'commentCard' || type === 'copyCommentCard';
};

import { KnownService, KnownServiceComponentProps } from './KnownService';

// eslint-disable-next-line @trello/less-matches-component
import styles from './KnownService.less';

interface OwnProps extends KnownServiceComponentProps {
  fullUrl: string;
  pathname: string;
  shortLink?: string;
  idAction: string;
}

interface StateProps {
  action?: ActionModel;
}

interface DispatchProps {
  loadAction: () => void;
}

export interface AllProps extends OwnProps, StateProps, DispatchProps {}

export const TrelloActionComponentUnconnected = (props: AllProps) => {
  useEffect(() => {
    if (!props.action) {
      props.loadAction();
    }
    // These actions should only run once on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIcon = () => {
    const { action } = props;
    const memberCreator = action ? action.memberCreator : null;

    if (
      !memberCreator ||
      !memberCreator.avatars ||
      !memberCreator.avatars[30]
    ) {
      return (
        <img
          className={styles.knownServiceIcon}
          alt="Trello Icon"
          src={require('resources/images/services/trello.png')}
        />
      );
    }

    return (
      <img
        className={styles.knownServiceIcon}
        alt="Trello Icon"
        src={memberCreator.avatars[30]}
      />
    );
  };

  const getText = () => {
    const { action } = props;

    if (!action || !action.display) {
      return '';
    }

    const idContext =
      action.data && action.data.card ? action.data.card.id : '';

    const entityTransformer = new EntityTransformers(action.display)
      .fixTranslatebleLocaleGroup('actions')
      .addUrlContext()
      .makeEntitiesFriendly();

    let displayText = '';
    if (isCommentLike(action)) {
      const entities = entityTransformer.value().entities;

      if (entities) {
        const memberCreator =
          entities.memberCreator.type === 'member'
            ? entities.memberCreator
            : null;
        const comment =
          entities.comment.type === 'comment' ? entities.comment : null;

        if (comment && memberCreator) {
          displayText = `${memberCreator.text}: ${
            markdown ? markdown.comments.textInline(comment.text) : comment.text
          }`;
        }
      }
    } else {
      displayText = entityTransformer.getEntityStrings(idContext, 'actions');
    }

    return truncate(displayText, 64);
  };

  const { action, fullUrl, pathname, shortLink, ...rest } = props;
  const anchorProps = omit(rest, ['loadAction', 'idAction']);

  return (
    <RouterLink
      {...anchorProps}
      href={pathname}
      className={styles.knownServiceLink}
      target=""
      rel=""
    >
      {getIcon()}
      {getText()}
    </RouterLink>
  );
};

const TrelloActionComponent: FunctionComponent<OwnProps> = ({
  shortLink,
  fullUrl,
  pathname,
  idAction,
}) => {
  const dispatch = useDispatch();
  const action = useSelector((state: State) =>
    getActionById(state, idAction || ''),
  );
  const load = useCallback(() => {
    dispatch(loadAction(idAction));
  }, [dispatch, idAction]);
  return (
    <TrelloActionComponentUnconnected
      fullUrl={fullUrl}
      shortLink={shortLink}
      pathname={pathname}
      loadAction={load}
      action={action}
      idAction={idAction}
    />
  );
};

export const TrelloAction: KnownService<OwnProps> = {
  match: {
    protocol: location.protocol,
    host: location.host,
    pathname: new RegExp(`\
^\
/c/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
    hash: new RegExp(`\
^\
\\#(?:comment|action)-([0-9a-f]{24})\
$\
`),
  },
  getMatchProps: ([fullUrl, pathname, shortLink, idAction]: string[]) => {
    return { fullUrl, pathname, shortLink, idAction };
  },
  Component: TrelloActionComponent,
};
