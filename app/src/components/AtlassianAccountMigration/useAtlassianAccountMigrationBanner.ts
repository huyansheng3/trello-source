import { useEffect, useState, useCallback } from 'react';

import { useFeatureFlag } from '@trello/feature-flag-client';

import {
  AtlassianAccountMigrationErrorCodes,
  getErrorCode,
} from './AtlassianAccountMigrationErrorCodes';
import { useAtlassianAccountMigrationQuery } from './AtlassianAccountMigrationQuery.generated';

import { getQueryParameter } from './getQueryParameter';
import { removeQueryParameters } from './removeQueryParameters';

export interface Options {
  forceShow?: boolean;
  wasInactiveMigration: boolean;
}

export function useAtlassianAccountMigrationBanner(
  { forceShow, wasInactiveMigration }: Options = {
    wasInactiveMigration: false,
  },
) {
  const [
    migrationErrorCode,
    setMigrationErrorCode,
  ] = useState<AtlassianAccountMigrationErrorCodes | null>(null);
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  const isTargeted = useFeatureFlag('aaaa.aa-migration-banner', false);
  const isAaMigrationEnabled = useFeatureFlag('aaaa.web.aa-migration', false);

  const dataHook = useAtlassianAccountMigrationQuery({
    variables: { memberId: 'me' },
  });

  const me = dataHook.data && dataHook.data.member;

  useEffect(() => {
    const onboardingValue = getQueryParameter('onboarding');
    const errorCode = onboardingValue && getErrorCode(onboardingValue);
    if (errorCode) {
      setMigrationErrorCode(errorCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Ensures we're done fetching data before opening the banner.
    if (!me) {
      return;
    }
    if (forceShow || (isTargeted && isAaMigrationEnabled)) {
      setShouldShowBanner(true);
    } else {
      setShouldShowBanner(false);
    }
  }, [me, forceShow, isTargeted, isAaMigrationEnabled]);

  const renderErrors = () => {
    if (!migrationErrorCode) {
      return false;
    }
    return true;
  };

  const renderBanner = () => {
    if (!shouldShowBanner || !me?.fullName || me?.isAaMastered) {
      return false;
    }

    return true;
  };

  const dismissErrors = useCallback(() => {
    removeQueryParameters('onboarding', 'onboarding');
    setMigrationErrorCode(null);
  }, []);

  const shouldRenderBanner = renderBanner();
  const shouldRenderErrors = renderErrors();

  return {
    me,
    migrationErrorCode,
    shouldRender: shouldRenderBanner || shouldRenderErrors,
    shouldRenderBanner,
    shouldRenderErrors,
    dismissErrors,
  };
}
