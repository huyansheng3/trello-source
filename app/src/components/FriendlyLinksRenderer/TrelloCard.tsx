import React, { useEffect, useCallback, FunctionComponent } from 'react';
import { omit } from 'underscore';

import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { loadCard } from 'app/gamma/src/modules/loaders/load-card';
import { State } from 'app/gamma/src/modules/types';
import { useSelector, useDispatch } from 'react-redux';
import { getCardByShortLink } from 'app/gamma/src/selectors/cards';
import { CardModel } from 'app/gamma/src/types/models';

import { KnownService, KnownServiceComponentProps } from './KnownService';

// eslint-disable-next-line @trello/less-matches-component
import styles from './KnownService.less';

interface OwnProps extends KnownServiceComponentProps {
  fullUrl: string;
  pathname: string;
  shortLink?: string;
}

interface StateProps {
  card?: CardModel;
}

interface DispatchProps {
  loadCard: () => void;
}

interface AllProps extends OwnProps, StateProps, DispatchProps {}

export const TrelloCardComponentUnconnected = (props: AllProps) => {
  useEffect(() => {
    if (!props.card) {
      props.loadCard();
    }
    // These actions should only run once on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { card, fullUrl, pathname, shortLink, ...rest } = props;
  const anchorProps = omit(rest, 'loadCard');

  const fallbackUrl = shortLink ? `/c/${shortLink}` : pathname;
  const url = card && card.url ? card.url : fallbackUrl;
  const name = card && card.name ? card.name : fullUrl;

  return (
    <RouterLink
      {...anchorProps}
      href={url}
      className={styles.knownServiceLink}
      target=""
      rel=""
    >
      <img
        className={styles.knownServiceIcon}
        alt="Trello Icon"
        src={require('resources/images/services/trello.png')}
      />
      {name}
    </RouterLink>
  );
};

const TrelloCardComponent: FunctionComponent<OwnProps> = ({
  shortLink,
  fullUrl,
  pathname,
}) => {
  const dispatch = useDispatch();
  const card = useSelector((state: State) =>
    getCardByShortLink(state, shortLink || fullUrl),
  );
  const load = useCallback(() => {
    dispatch(loadCard(shortLink || fullUrl, false));
  }, [dispatch, fullUrl, shortLink]);
  return (
    <TrelloCardComponentUnconnected
      fullUrl={fullUrl}
      shortLink={shortLink}
      pathname={pathname}
      loadCard={load}
      card={card}
    />
  );
};

export const TrelloCard: KnownService<OwnProps> = {
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
  },
  getMatchProps: ([fullUrl, pathname, shortLink]: string[]) => {
    return { fullUrl, pathname, shortLink };
  },
  Component: TrelloCardComponent,
};
