import React, { AnchorHTMLAttributes, useCallback, useContext } from 'react';

import {
  KnownService,
  KnownServiceComponentProps,
  execMatch,
} from './KnownService';

import { FogBugzCase } from './FogBugzCase';
import { KilnCase } from './KilnCase';
import { TrelloAction } from './TrelloAction';
import { TrelloBoard } from './TrelloBoard';
import { TrelloCard } from './TrelloCard';
import {
  SmartLink,
  SmartLinkAnalyticsContext,
} from 'app/src/components/SmartMedia';

export const FriendlyLink = (
  props: AnchorHTMLAttributes<HTMLAnchorElement>,
) => {
  const context = useContext(SmartLinkAnalyticsContext);
  const knownServices: KnownService<KnownServiceComponentProps>[] = [
    TrelloBoard,
    TrelloAction,
    TrelloCard,
    FogBugzCase,
    KilnCase,
  ];

  const { href, children, ...rest } = props;
  const plainLink = useCallback(() => <a {...props} />, [props]);

  // if href !== children then we want to show the link name that the user set
  if (href && href === children) {
    for (const knownService of knownServices) {
      const matchedValues = execMatch(knownService, href);
      if (matchedValues !== null) {
        const { Component, getMatchProps } = knownService;

        return <Component {...rest} {...getMatchProps(matchedValues)} />;
      }
    }

    return (
      <SmartLink url={href} plainLink={plainLink} analyticsContext={context} />
    );
  }

  return plainLink();
};
