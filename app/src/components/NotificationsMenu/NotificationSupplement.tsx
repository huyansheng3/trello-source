/**
 * This component can render supplemental information below a given notification,
 * for example upsells, learn more links, or other supplemental information,
 * not integral to the information in the notification.
 */
import React, { Suspense, useMemo } from 'react';

import { Spinner } from '@trello/nachos/spinner';
import { useLazyComponent } from '@trello/use-lazy-component';
import { NotificationModel } from 'app/gamma/src/types/models';
import styles from './NotificationSupplement.less';

interface NotificationSupplementProps
  extends Pick<
    NotificationModel,
    'appCreator' | 'data' | 'type' | 'idMemberCreator'
  > {}

export const NotificationSupplement: React.FunctionComponent<NotificationSupplementProps> = ({
  appCreator,
  data,
  type,
  idMemberCreator,
}) => {
  const ButlerRuleFailedBoardSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-rule-failed-board-supplement" */ './ButlerRuleFailedBoardSupplement'
      ),
    {
      preload: type === 'butlerRuleFailedBoard',
      namedImport: 'ButlerRuleFailedBoardSupplement',
    },
  );
  const ButlerQuotaApproachingMemberSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-quota-approaching-member-supplement" */ './ButlerQuotaApproachingMemberSupplement'
      ),
    {
      preload: type === 'butlerQuotaApproachingMember',
      namedImport: 'ButlerQuotaApproachingMemberSupplement',
    },
  );
  const ButlerQuotaExceededMemberSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-quota-exceeded-member-supplement" */ './ButlerQuotaExceededMemberSupplement'
      ),
    {
      preload: type === 'butlerQuotaExceededMember',
      namedImport: 'ButlerQuotaExceededMemberSupplement',
    },
  );
  const ButlerQuotaExceededOrganizationSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-quota-exceeded-organization-supplement" */ './ButlerQuotaExceededOrganizationSupplement'
      ),
    {
      preload: type === 'butlerQuotaExceededOrganization',
      namedImport: 'ButlerQuotaExceededOrganizationSupplement',
    },
  );
  const ExportCompleteOrganizationSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "export-complete-organization-supplement" */ './ExportCompleteSupplement'
      ),
    {
      preload: type === 'exportCompleteOrganization',
      namedImport: 'ExportCompleteSupplement',
    },
  );

  const ButlerQuotaApproachingOrganizationSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-quota-approaching-organization-supplement" */ './ButlerQuotaApproachingOrganizationSupplement'
      ),
    {
      preload: type === 'butlerQuotaApproachingOrganization',
      namedImport: 'ButlerQuotaApproachingOrganizationSupplement',
    },
  );

  const RequestAccessBoardInviteSupplement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "request-access-board-invite-supplement" */ './RequestAccessBoardInviteSupplement'
      ),
    {
      preload: /^requestAccessBoard/.test(type!),
      namedImport: 'RequestAccessBoardInviteSupplement',
    },
  );

  const component = useMemo(() => {
    switch (type) {
      case 'butlerRuleFailedBoard': {
        if (!data?.rule) return null;
        const { rule } = data;
        return (
          <ButlerRuleFailedBoardSupplement
            application={appCreator?.name || ''}
            rule={rule}
          />
        );
      }
      case 'butlerQuotaApproachingMember': {
        return <ButlerQuotaApproachingMemberSupplement />;
      }
      case 'butlerQuotaApproachingOrganization': {
        return (
          <ButlerQuotaApproachingOrganizationSupplement
            orgId={data?.team?.id}
          />
        );
      }
      case 'butlerQuotaExceededMember': {
        return <ButlerQuotaExceededMemberSupplement />;
      }
      case 'butlerQuotaExceededOrganization': {
        return (
          <ButlerQuotaExceededOrganizationSupplement orgId={data?.team?.id} />
        );
      }
      case 'exportCompleteOrganization': {
        if (data?.team?.id && data?.idExport) {
          return (
            <ExportCompleteOrganizationSupplement
              organization={data.team}
              idExport={data.idExport}
            />
          );
        }
        return null;
      }
      case 'requestAccessBoard':
      case 'requestAccessBoardWithoutOrganization':
      case 'requestAccessBoardNotInOrganization': {
        if (
          data?.board &&
          data?.board?.name &&
          data?.board?.shortLink &&
          data?.board?.id &&
          idMemberCreator
        ) {
          return (
            <RequestAccessBoardInviteSupplement
              board={data.board}
              card={data?.card}
              inviteMemberId={idMemberCreator}
            />
          );
        }
        return null;
      }
      default:
        return null;
    }
  }, [
    type,
    data,
    appCreator?.name,
    idMemberCreator,
    ButlerRuleFailedBoardSupplement,
    ButlerQuotaApproachingMemberSupplement,
    ButlerQuotaApproachingOrganizationSupplement,
    ButlerQuotaExceededMemberSupplement,
    ButlerQuotaExceededOrganizationSupplement,
    ExportCompleteOrganizationSupplement,
    RequestAccessBoardInviteSupplement,
  ]);

  if (component) {
    return (
      <Suspense
        fallback={
          <Spinner
            small
            centered
            wrapperClassName={styles.notificationSupplements}
          />
        }
      >
        <div className={styles.notificationSupplements}>{component}</div>
      </Suspense>
    );
  }
  return null;
};
