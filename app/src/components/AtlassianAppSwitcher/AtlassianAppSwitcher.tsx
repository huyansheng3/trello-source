import React, { FunctionComponent } from 'react';
import AtlassianSwitcher from '@atlassian/switcher';
import {
  createAvailableProductsProvider,
  createJoinableSitesProvider,
  createProductConfigurationProvider,
} from '@atlassian/switcher/create-custom-provider';
import { IntlProvider } from 'react-intl';
import FabricAnalyticsListeners, {
  FabricChannel,
} from '@atlaskit/analytics-listeners';
import { Analytics } from '@trello/atlassian-analytics';
import { N300, N800 } from '@trello/colors';
import { TargetType } from '@atlassiansox/cross-flow-support/trello';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import {
  ConfluenceAutoProvisionedSiteFromTrello,
  JoinableSiteClickHandler,
} from '@atlassian/switcher/dist/types/types';

export enum AtlassianSwitcherVariations {
  CONTROL = 'control',
  NOT_ENROLLED = 'not-enrolled',
  EXPERIMENT = 'experiment',
}

const trelloTheme = {
  primaryTextColor: N800,
  secondaryTextColor: N300,
  primaryHoverBackgroundColor: '#E0E2E5',
  secondaryHoverBackgroundColor: '#F5F6F7',
};

interface AtlassianAppSwitcherProps {
  aaId?: string;
  triggerXFlow: (productKey: TargetType) => void;
  onDiscoverMoreClicked: () => void;
  highlightedJoinableItemHref?: string;
  onJoinableSiteClicked?: JoinableSiteClickHandler;
  joinableSitesDataProvider:
    | ReturnType<typeof createJoinableSitesProvider>
    | undefined;
  availableProductsDataProvider:
    | ReturnType<typeof createAvailableProductsProvider>
    | undefined;
  productConfigurationDataProvider:
    | ReturnType<typeof createProductConfigurationProvider>
    | undefined;
  nonAaMastered: boolean;
  defaultSignupEmail?: string | null;
  locale?: string;
  onClose: () => void;
  confluenceAutoProvisionedSiteFromTrello?: ConfluenceAutoProvisionedSiteFromTrello;
  enableRemoteConfiguration?: boolean;
  enableRemoteAdminLinks?: boolean;
}

export const AtlassianAppSwitcher: FunctionComponent<AtlassianAppSwitcherProps> = ({
  aaId,
  triggerXFlow,
  onDiscoverMoreClicked,
  joinableSitesDataProvider,
  highlightedJoinableItemHref,
  onJoinableSiteClicked,
  availableProductsDataProvider,
  nonAaMastered,
  defaultSignupEmail,
  locale = 'en',
  onClose,
  productConfigurationDataProvider,
  confluenceAutoProvisionedSiteFromTrello,
  enableRemoteConfiguration,
  enableRemoteAdminLinks,
}) => {
  const recommendationsFeatureFlags = { isProductStoreInTrelloEnabled: true };

  const discoverySwitcherProps = {
    triggerXFlow,
    onDiscoverMoreClicked,
    recommendationsFeatureFlags,
    highlightedJoinableItemHref,
    onJoinableSiteClicked,
    joinableSitesDataProvider,
    availableProductsDataProvider,
    productConfigurationDataProvider,
  };
  const analyticsContextData = {
    navigationCtx: {
      attributes: {
        aaId,
        isAaMastered: !nonAaMastered,
      },
    },
  };

  return (
    <IntlProvider locale={locale}>
      {
        <FabricAnalyticsListeners
          client={Analytics.dangerouslyGetAnalyticsWebClient()}
          excludedChannels={[
            FabricChannel.atlaskit,
            FabricChannel.elements,
            FabricChannel.editor,
            FabricChannel.media,
          ]}
        >
          <AnalyticsContext data={analyticsContextData}>
            <AtlassianSwitcher
              product="trello"
              appearance="standalone"
              theme={trelloTheme}
              {...discoverySwitcherProps}
              nonAaMastered={nonAaMastered}
              defaultSignupEmail={
                defaultSignupEmail === null ? undefined : defaultSignupEmail
              }
              onClose={onClose}
              enableRemoteConfiguration={enableRemoteConfiguration}
              enableRemoteAdminLinks={enableRemoteAdminLinks}
              confluenceAutoProvisionedSiteFromTrello={
                confluenceAutoProvisionedSiteFromTrello
              }
            />
          </AnalyticsContext>
        </FabricAnalyticsListeners>
      }
    </IntlProvider>
  );
};
