import React, {
  FunctionComponent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useLazyComponent } from '@trello/use-lazy-component';

import {
  Overlay,
  OverlayAlignment,
  OverlayBackground,
} from 'app/src/components/Overlay';
import { noop } from 'app/src/noop';

import { useAtlassianAccountMigrationConfirmation } from './useAtlassianAccountMigrationConfirmation';
import { checkUserNeedsSyncUnblocked } from 'app/src/components/AtlassianAccountMigrationStage/checkUserNeedsSyncUnblocked';

interface MigrationAnalyticsContext {
  organizationId?: string | null;
  totalEmailAddresses?: number;
  totalClaimableEmailAddresses?: number;
  isProfileSyncUnblocked?: boolean | null;
  isSsoEnforced?: boolean | null;
}

export const forceActiveMigrationQuery = /[?&]forceActiveMigration=true/i;
export const forceEnterpriseMigrationQuery = /[?&]forceEnterpriseMigration=true/i;
export const forceInactiveMigrationQuery = /[?&]forceInactiveMigration=true/i;

export interface AtlassianAccountMigrationConfirmationProps {
  forceShow?: boolean;
  wasActiveMigration: boolean;
  wasEnterpriseMigration: boolean;
}

const MigrationOverlay: FunctionComponent = ({ children }) => (
  <Overlay
    background={OverlayBackground.LIGHT}
    closeOnEscape={false}
    onClose={noop}
    alignment={OverlayAlignment.TOP}
  >
    <Suspense fallback={null}>{children}</Suspense>
  </Overlay>
);

export const AtlassianAccountMigrationConfirmation: FunctionComponent<AtlassianAccountMigrationConfirmationProps> = ({
  forceShow,
  wasActiveMigration,
  wasEnterpriseMigration,
}) => {
  const AtlassianAccountMigrationConfirmationDialog = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "aa-migration-confirmation" */ './AtlassianAccountMigrationConfirmationDialog'
      ),
  );

  const analyticsContext: MigrationAnalyticsContext = useMemo(() => {
    return {
      organizationId: null,
      isProfileSyncUnblocked: null,
      isSsoEnforced: null,
    };
  }, []);

  const [enterpriseName, setEnterpriseName] = useState('');
  const [isSsoEnforced, setIsSsoEnforced] = useState(false);
  const [isProfileSyncUnblocked, setIsProfileSyncUnblocked] = useState(false);

  const {
    me,
    shouldRender,
    dismissConfirmation,
  } = useAtlassianAccountMigrationConfirmation();

  useEffect(() => {
    const aaBlockSyncUntil = me?.aaBlockSyncUntil;
    const needsSyncUnblocked = checkUserNeedsSyncUnblocked(aaBlockSyncUntil);
    const profileSyncUnblocked = !!aaBlockSyncUntil && !needsSyncUnblocked;
    setIsProfileSyncUnblocked(profileSyncUnblocked);
    analyticsContext.isProfileSyncUnblocked = profileSyncUnblocked;

    if (me?.idEnterprise && me?.enterprises.length) {
      const enterprise = me.enterprises.filter((ent) => {
        return ent.id === me.idEnterprise;
      })[0];
      const ssoOnly = !!enterprise.prefs?.ssoOnly;
      setEnterpriseName(enterprise.displayName);
      setIsSsoEnforced(ssoOnly);

      analyticsContext.isSsoEnforced = ssoOnly;
      analyticsContext.organizationId = me.idEnterprise;
    }
  }, [analyticsContext, me]);

  const analyticsSource = wasActiveMigration
    ? 'aaMigrationWizardConfirmationScreen'
    : wasEnterpriseMigration
    ? 'aaEnterpriseMigrationConfirmationScreen'
    : 'aaInactiveMigrationConfirmationScreen';

  const logins = useMemo(() => {
    return (me && [...me?.logins]) || [];
  }, [me]);

  if (me) {
    analyticsContext.totalEmailAddresses = logins.length;
    analyticsContext.totalClaimableEmailAddresses = logins.filter(
      (l) => l.claimable,
    ).length;
  }

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsSource,
      attributes: analyticsContext,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDismiss = useCallback(() => {
    dismissConfirmation();

    Analytics.sendClosedComponentEvent({
      componentType: 'overlay',
      componentName: 'atlassianAccountMigrationOverlay',
      source: analyticsSource,
      attributes: analyticsContext,
    });
  }, [analyticsContext, analyticsSource, dismissConfirmation]);

  if (shouldRender) {
    return (
      <MigrationOverlay>
        <AtlassianAccountMigrationConfirmationDialog
          id={me?.id || ''}
          name={me?.fullName || ''}
          email={me?.email || ''}
          enterpriseName={enterpriseName}
          isProfileSyncUnblocked={isProfileSyncUnblocked}
          isSsoEnforced={isSsoEnforced}
          wasActiveMigration={wasActiveMigration}
          wasEnterpriseMigration={wasEnterpriseMigration}
          onDismiss={onDismiss}
          analyticsSource={analyticsSource}
          analyticsContext={analyticsContext}
        />
      </MigrationOverlay>
    );
  }
  return null;
};
