import React, { Suspense } from 'react';
import { memberId } from '@trello/session-cookie';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useGoldPremiumFreeTrialBanner } from 'app/src/components/GoldSunset/GoldPremiumFreeTrialBanner/useGoldPremiumFreeTrialBanner';

export const Banners = () => {
  const AtlassianAccountMigrationStageBanners = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration-stage-banners" */ 'app/src/components/AtlassianAccountMigrationStage'
      ),
    { namedImport: 'AtlassianAccountMigrationStageBanners', preload: false },
  );
  const SomethingsWrongBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "somethings-wrong-banner" */ 'app/src/components/SomethingsWrongBanner'
      ),
    { namedImport: 'SomethingsWrongBanner', preload: false },
  );

  const BoardBannerList = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-banner-list" */ 'app/src/components/BoardBannerList'
      ),
    { namedImport: 'BoardBannerList', preload: false },
  );

  const GoldPremiumFreeTrialBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "gold-premium-free-trial-banner" */ 'app/src/components/GoldSunset/GoldPremiumFreeTrialBanner'
      ),
    { namedImport: 'GoldPremiumFreeTrialBanner', preload: false },
  );

  const wouldRenderSomethingsWrongBanner = useFeatureFlag(
    'fep.show_somethings_wrong',
    false,
  );

  const {
    wouldRender: wouldRenderGoldPremiumFreeTrialBanner,
    // experience: goldPremiumFreeTrialExperience,
  } = useGoldPremiumFreeTrialBanner();

  // Don't render any of the banners if the user isn't logged in
  if (!memberId) {
    return null;
  }

  let banner;

  // Chain conditional statements in order of banner priority
  if (wouldRenderSomethingsWrongBanner) {
    banner = (
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <SomethingsWrongBanner />
        </ChunkLoadErrorBoundary>
      </Suspense>
    );
  } else if (wouldRenderGoldPremiumFreeTrialBanner) {
    banner = (
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <GoldPremiumFreeTrialBanner />
        </ChunkLoadErrorBoundary>
      </Suspense>
    );
  } else {
    // TODO: Lift business logic from each banner to help avoid performance problems.
    // See: https://hello.atlassian.net/wiki/spaces/TRELLOFE/pages/1221169471/Building+and+managing+targeted+experiences
    banner = (
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <AtlassianAccountMigrationStageBanners />
        </ChunkLoadErrorBoundary>
        <ChunkLoadErrorBoundary fallback={null}>
          <BoardBannerList />
        </ChunkLoadErrorBoundary>
      </Suspense>
    );
  }

  return <ComponentWrapper>{banner}</ComponentWrapper>;
};
