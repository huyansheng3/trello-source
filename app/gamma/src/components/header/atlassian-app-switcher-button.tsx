import React, { FunctionComponent, useCallback, Suspense } from 'react';
import { ApplicationSwitcherIcon } from '@trello/nachos/icons/application-switcher';
import { HeaderTestIds } from '@trello/test-ids';
import { MemberModel } from 'app/gamma/src/types/models';
import HeaderButton from './button';
import classnames from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';
import { AtlassianSwitcherPrefetchTrigger } from '@atlassian/switcher';
import {
  createAvailableProductsProvider,
  createJoinableSitesProvider,
  createProductConfigurationProvider,
  fetchProductRecommendations,
} from '@atlassian/switcher/create-custom-provider';
import { atlassianApiGateway } from '@trello/config';
import {
  setLocationToWacSoftware,
  setLocationToTryProduct,
  SWITCHER_AVAILABLE_PRODUCTS_URL,
  UtmCampaign,
} from 'app/src/components/CrossFlowProvider';
import { usePopover, Popover } from '@trello/nachos/popover';
import { AtlassianAppSwitcher } from 'app/src/components/AtlassianAppSwitcher';
import { forTemplate } from '@trello/i18n';
import {
  useCrossFlow,
  TargetType,
} from '@atlassiansox/cross-flow-support/trello';
import { useLazyComponent } from '@trello/use-lazy-component';
import {
  useIsPushTouchpointsEnabled,
  usePtSwitcherNudgeState,
} from 'app/src/components/SwitcherSpotlight';
import styles from './header.less';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useConfluenceAutoProvisionedSiteFromTrello } from 'app/src/components/ConfluenceAutoProvisionSiteFromTrello';

interface AtlassianAppSwitcherButtonProps {
  member: MemberModel | undefined;
  redesign?: boolean;
}

const format = forTemplate('cross_flow');

/* eslint-disable @trello/no-module-logic */
const availableSitesDataProviderForAa = createAvailableProductsProvider(
  SWITCHER_AVAILABLE_PRODUCTS_URL,
);

const joinableSitesDataProviderForAa = createJoinableSitesProvider(
  fetchProductRecommendations(`${atlassianApiGateway}gateway/api/invitations`),
);

const productConfigurationDataProvider = createProductConfigurationProvider({
  url: `${atlassianApiGateway}gateway/api/available-products/api/product-configuration`,
  useRemoteProductConfiguration: true,
});
/* eslint-enable @trello/no-module-logic */

type JoinableSitesDataProvider =
  | typeof joinableSitesDataProviderForAa
  | undefined;

export const AtlassianAppSwitcherButton: FunctionComponent<AtlassianAppSwitcherButtonProps> = ({
  member,
  redesign = false,
}) => {
  const locale = member?.prefs?.locale;
  const aaId = member?.aaId || undefined;
  const isAaMastered = member?.isAaMastered;
  const defaultSignupEmail = member?.email;

  let joinableSitesDataProvider: JoinableSitesDataProvider = joinableSitesDataProviderForAa;

  const useAppSwitcherRemoteConfigurationFlag = useFeatureFlag(
    'app-switcher-enable-remote-configuration',
    false,
  );
  const useAppSwitcherRemoteAdminConfigurationFlag = useFeatureFlag(
    'app-switcher-enable-remote-admin-configuration',
    false,
  );
  const onShow = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'atlassianSwitcherHeaderButton',
      source: 'appHeader',
      attributes: {
        aaId,
        isAaMastered,
      },
    });
  }, [aaId, isAaMastered]);

  const {
    popoverProps,
    triggerRef,
    toggle: togglePopover,
    hide,
  } = usePopover<HTMLButtonElement>({ onShow });

  /** Push Touchpoints Switcher Nudge. See more: go/ptprod */
  const memberId = member?.id ?? '';
  const menuOpen = popoverProps.isVisible;
  const ptEnabled = useIsPushTouchpointsEnabled(member);
  const ptNudgeState = usePtSwitcherNudgeState(memberId, menuOpen, ptEnabled);
  if (ptEnabled) joinableSitesDataProvider = ptNudgeState.provider;

  const {
    showConfluenceBannerNotification,
    onConfluenceBannerNotificationClicked,
    displayedBannerMessage,
  } = useConfluenceAutoProvisionedSiteFromTrello(ptEnabled, ptNudgeState);

  const crossFlow = useCrossFlow();

  const handleTryClick = useCallback(
    (productKey: TargetType) => {
      hide();
      if (crossFlow.isEnabled) {
        crossFlow.api.open({
          journey: 'decide',
          targetProduct: productKey,
          sourceComponent: 'atlassian-switcher',
          sourceContext: 'try',
          experimentalOptions: {
            crossFlowSupportInTrelloRollout: true,
            enhancedJSWValuePropositionEnabled: true,
          },
        });
      } else {
        setLocationToTryProduct(productKey, {
          campaign: UtmCampaign.ATLASSIAN_SWITCHER,
        });
      }
    },
    [hide, crossFlow],
  );

  const handleDiscoverMoreClick = useCallback(() => {
    hide();

    if (crossFlow.isEnabled) {
      crossFlow.api.open({
        journey: 'discover',
        sourceComponent: 'atlassian-switcher',
        sourceContext: 'more',
        experimentalOptions: {
          crossFlowSupportInTrelloRollout: true,
          enhancedJSWValuePropositionEnabled: true,
        },
      });
    } else {
      setLocationToWacSoftware({ campaign: UtmCampaign.ATLASSIAN_SWITCHER });
    }
  }, [hide, crossFlow]);

  const SwitcherSpotlight = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "switcher-spotlight" */ 'app/src/components/SwitcherSpotlight/SwitcherSpotlight'
      ),
    { namedImport: 'SwitcherSpotlight', preload: ptEnabled },
  );

  const renderHeaderButton = useCallback(
    () => (
      <HeaderButton
        icon={<ApplicationSwitcherIcon color="light" />}
        onClick={togglePopover}
        ref={triggerRef}
        testId={HeaderTestIds.AtlassianAppSwitcher}
        ariaLabel={format('switch to')}
        className={classnames(
          redesign && styles.headerButtonRedesign,
          redesign && styles.appSwitcherRedesign,
        )}
      />
    ),
    [redesign, togglePopover, triggerRef],
  );

  return (
    <>
      <AtlassianSwitcherPrefetchTrigger
        joinableSitesDataProvider={joinableSitesDataProvider}
        availableProductsDataProvider={availableSitesDataProviderForAa}
        productConfigurationDataProvider={
          useAppSwitcherRemoteConfigurationFlag
            ? productConfigurationDataProvider
            : undefined
        }
      >
        {ptEnabled ? (
          <Suspense fallback={renderHeaderButton()}>
            <SwitcherSpotlight nudgeState={ptNudgeState}>
              {renderHeaderButton()}
            </SwitcherSpotlight>
          </Suspense>
        ) : (
          renderHeaderButton()
        )}
      </AtlassianSwitcherPrefetchTrigger>
      <Popover
        {...popoverProps}
        title={format('more from atlassian')}
        testId={HeaderTestIds.AtlassianAppSwitcher}
      >
        <AtlassianAppSwitcher
          aaId={aaId}
          triggerXFlow={handleTryClick}
          onDiscoverMoreClicked={handleDiscoverMoreClick}
          joinableSitesDataProvider={joinableSitesDataProvider}
          productConfigurationDataProvider={productConfigurationDataProvider}
          highlightedJoinableItemHref={ptNudgeState.productUrl}
          onJoinableSiteClicked={ptNudgeState.onJoinableSiteClicked}
          availableProductsDataProvider={availableSitesDataProviderForAa}
          nonAaMastered={!isAaMastered}
          defaultSignupEmail={defaultSignupEmail}
          onClose={hide}
          locale={locale}
          confluenceAutoProvisionedSiteFromTrello={{
            showConfluenceBannerNotification,
            onConfluenceBannerNotificationClicked,
            displayedBannerMessage,
          }}
          enableRemoteAdminLinks={useAppSwitcherRemoteAdminConfigurationFlag}
          enableRemoteConfiguration={useAppSwitcherRemoteConfigurationFlag}
        />
      </Popover>
    </>
  );
};
