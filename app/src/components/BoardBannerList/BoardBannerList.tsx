import React, { Suspense } from 'react';
import classNames from 'classnames';

import { Banner } from 'app/src/components/Banner';
import { ButtonLink } from '@trello/nachos/button';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { forNamespace } from '@trello/i18n';
import styles from './BoardBannerList.less';
import { N0 } from '@trello/colors';
import { useBoardBannerList, MemberBanner } from './useBoardBannerList';
import { useRouteId, RouteId } from '@trello/routes';

import {
  Analytics,
  getScreenFromUrl,
  SendViewedBannerEvent,
  SendClickedButtonEvent,
} from '@trello/atlassian-analytics';
import { currentModelManager } from 'app/scripts/controller/currentModelManager';

const format = forNamespace();

const LeftWaveImageUrl = require('resources/images/onboarding-banner/banner-wave-left.svg');
const TacoImageUrl = require('resources/images/onboarding-banner/Taco.svg');
const RightWaveImageUrl = require('resources/images/onboarding-banner/banner-wave-right.svg');

export const preloadOnboardingImages = () => {
  new Image().src = LeftWaveImageUrl;
  new Image().src = TacoImageUrl;
  new Image().src = RightWaveImageUrl;
};

export const BoardBannerList: React.FC = () => {
  const routeId = useRouteId();
  const memberHomeOrBoardRoute = [RouteId.BOARD, RouteId.MEMBER_HOME].includes(
    routeId,
  );
  const EVENT_BANNER_IDS = ['banner-enterprise-discoverable'];

  const flag: boolean = useFeatureFlag(
    'enterprise.discover-trello-use-in-your-org',
    false,
  );

  const {
    banners,
    handleDismissClick,
    shouldRenderBanner,
  } = useBoardBannerList({ skip: !flag });

  const buildAnalyticsEvent = (
    data: Partial<SendClickedButtonEvent & SendViewedBannerEvent>,
  ): SendClickedButtonEvent | SendViewedBannerEvent => {
    const { buttonName, bannerName, source } = data;
    const board = currentModelManager.getCurrentBoard();
    const containers = {
      board: {
        id: board?.id,
      },
      workspace: {
        id: board?.get('idOrganization'),
      },
    };

    const event: Partial<SendClickedButtonEvent & SendViewedBannerEvent> = {
      containers,
      source: source || getScreenFromUrl(),
    };

    if (buttonName) {
      event.buttonName = buttonName;
    }

    if (bannerName) {
      event.bannerName = bannerName;
    }

    return event as SendClickedButtonEvent | SendViewedBannerEvent;
  };

  const dismissBanner = async (banner: MemberBanner) => {
    if (EVENT_BANNER_IDS.includes(banner.id)) {
      const event = buildAnalyticsEvent({
        buttonName: 'enterpriseDiscoverBannerDismissButton',
        source: 'enterpriseNetworkDiscoveryBanner',
      }) as SendClickedButtonEvent;
      Analytics.sendClickedButtonEvent(event);
    }
    if (typeof handleDismissClick === 'function') {
      await handleDismissClick(banner);
    }
  };

  const handlePromptClick = (banner: MemberBanner) => {
    if (EVENT_BANNER_IDS.includes(banner.id)) {
      const event = buildAnalyticsEvent({
        buttonName: 'enterpriseDiscoverBannerLearnMoreButton',
        source: 'enterpriseNetworkDiscoveryBanner',
      }) as SendClickedButtonEvent;
      Analytics.sendClickedButtonEvent(event);
    }
  };

  if (!memberHomeOrBoardRoute) {
    return null;
  }

  if (!flag) {
    return null;
  }

  banners.forEach((banner) => {
    if (EVENT_BANNER_IDS.includes(banner.id)) {
      const event = buildAnalyticsEvent({
        bannerName: 'enterpriseNetworkDiscoveryBanner',
        source: 'enterpriseNetworkDiscoveryBanner',
      }) as SendViewedBannerEvent;
      Analytics.sendViewedBannerEvent(event);
    }
  });

  const renderBanner = () => {
    return (
      <div>
        {banners.map((banner, index) => {
          return (
            <Banner
              bannerColor={N0}
              shadow
              roundedCorners
              alignCloseTop
              className={styles.banner}
              // eslint-disable-next-line react/jsx-no-bind
              onDismiss={
                banner.dismissible ? () => dismissBanner(banner) : undefined
              }
              key={`banner-${index}-${banner.id}`}
            >
              <img
                alt=""
                src={TacoImageUrl}
                className={classNames(styles.tacoImg)}
              />
              <img
                alt=""
                src={LeftWaveImageUrl}
                className={classNames(styles.waveImg, styles.leftWaveImg)}
              />
              <div className={styles.container}>
                <div className={styles.body}>
                  <div className={styles.bannerMsg}>
                    <div>
                      <span>
                        <p>{banner.message}</p>
                      </span>
                    </div>
                  </div>
                  {banner.url && (
                    <div className={styles.controls}>
                      <ButtonLink
                        link={banner.url}
                        openInNewTab
                        className={styles.learnMoreButton}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={async () => {
                          handlePromptClick(banner);
                          await handleDismissClick(banner);
                        }}
                      >
                        {format('learn more button')}
                      </ButtonLink>
                    </div>
                  )}
                </div>
              </div>
              <img
                alt=""
                src={RightWaveImageUrl}
                className={classNames(styles.waveImg, styles.rightWaveImg)}
              />
            </Banner>
          );
        })}
      </div>
    );
  };

  return shouldRenderBanner ? (
    <>
      <Suspense fallback={null}>{renderBanner()}</Suspense>
    </>
  ) : null;
};
