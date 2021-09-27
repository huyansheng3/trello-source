import { useEffect, useState, useCallback } from 'react';
import { useFeatureFlag } from '@trello/feature-flag-client';

import { useAtlassianAccountMigrationQuery } from './AtlassianAccountMigrationQuery.generated';

import { getQueryParameter } from './getQueryParameter';
import { removeQueryParameters } from './removeQueryParameters';

import { checkUserNeedsSyncUnblocked } from 'app/src/components/AtlassianAccountMigrationStage/checkUserNeedsSyncUnblocked';
import { HYGIENE_MESSAGE_ID } from 'app/src/components/EmailHygieneWizard/emailHygieneOneTimeMessageIds';
import { INACTIVE_MIGRATION_MESSAGE_ID } from './inactiveMigrationMessageId';

export function useAtlassianAccountMigrationConfirmation() {
  const [shouldShowConfirmation, setShouldShowConfirmation] = useState(false);
  const [needsProfileSyncUnblocked, setNeedsProfileSyncUnblocked] = useState(
    false,
  );
  const isEnterpriseMigrationEnabled = useFeatureFlag(
    'aaaa.web.enterprise-aa-migration-confirmation',
    false,
  );

  const dataHook = useAtlassianAccountMigrationQuery({
    variables: { memberId: 'me' },
  });

  const me = dataHook.data && dataHook.data.member;
  const aaBlockSyncUntil = me?.aaBlockSyncUntil;

  const hasCompletedHygiene = me?.oneTimeMessagesDismissed?.includes(
    HYGIENE_MESSAGE_ID,
  );
  const wasInactiveMigration = me?.oneTimeMessagesDismissed?.includes(
    INACTIVE_MIGRATION_MESSAGE_ID,
  );

  useEffect(() => {
    const shouldShowConfirmationOverlay =
      getQueryParameter('onboarding') === 'success' ||
      getQueryParameter('auto_onboarding') === 'success';

    setShouldShowConfirmation(shouldShowConfirmationOverlay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const days = me?.idEnterprise ? 1 : 3;
    const needsSyncUnblocked = checkUserNeedsSyncUnblocked(
      aaBlockSyncUntil,
      days,
    );
    setNeedsProfileSyncUnblocked(!!aaBlockSyncUntil && needsSyncUnblocked);
  }, [aaBlockSyncUntil, me?.idEnterprise]);

  const renderConfirmation = () => {
    // Never show the confirmation dialog to users who are not Aa-governed.
    if (!me?.isAaMastered) {
      return false;
    }

    // If a enterprise-managed user was migrated and has a value for aaBlockSyncUntil,
    // but that timestamp is not within the next 24 hours, then they should be
    // presented with a confirmation dialog. Dismissing the dialog will set
    // aaBlockSyncUntil to now + 1d.
    // Also, make sure the feature flag is enabled.
    if (me?.idEnterprise) {
      return isEnterpriseMigrationEnabled && needsProfileSyncUnblocked;
    }

    // If a user was inactively migrated, profile sync status shouldn't matter.
    // The user should be presented with the confirmation dialog if (and only if)
    // the query parameter is present when this component mounts.
    if (wasInactiveMigration) {
      // However, if a user has a value for aaBlockSyncUntil and that timestamp
      // is _not_ within the next 3 days, then they should not be presented with
      // a confirmation dialog. This shouldn't actually be possible, because
      // inactively migrated users should have the block cleared upon login,
      // but there may be some ways around that.
      if (!!aaBlockSyncUntil && needsProfileSyncUnblocked) {
        return false;
      }
      return shouldShowConfirmation;
    }

    // If a user was actively migrated, profile sync status doesn't matter at all.
    // The user should be presented with the confirmation dialog if (and only if)
    // the query parameter is present when this component mounts.
    if (hasCompletedHygiene) {
      return shouldShowConfirmation;
    }
    return false;
  };

  const dismissConfirmation = useCallback(() => {
    removeQueryParameters('onboarding', 'auto_onboarding');
    setNeedsProfileSyncUnblocked(false);
    setShouldShowConfirmation(false);
  }, []);

  const shouldRender = renderConfirmation();

  return {
    me,
    shouldRender,
    dismissConfirmation,
  };
}
