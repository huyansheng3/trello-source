import React from 'react';
import styles from './WorkspaceDetail.less';
import { WorkspaceLogo } from 'app/src/components/WorkspaceLogo';
import { Analytics } from '@trello/atlassian-analytics';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { UserRelationshipToWorkspace } from './useCurrentWorkspace';
import { CollapseSidebarButton } from './CollapseSidebarButton';
import { ProductFeatures } from '@trello/product-features';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('workspace_detail');

export const getWorkspacePlanType = (
  orgProducts: number[],
  userRelationshipToWorkspace: UserRelationshipToWorkspace,
) => {
  const isGuest = userRelationshipToWorkspace === 'GUEST';
  const isPersonal = userRelationshipToWorkspace === 'PERSONAL';
  const noRelationship = userRelationshipToWorkspace === 'NONE';

  if (isGuest || isPersonal || noRelationship) {
    return null;
  }

  const productCode = orgProducts[0];
  const isEnterprise = ProductFeatures.isEnterpriseProduct(productCode);
  const isStandard = ProductFeatures.isStandardProduct(productCode);
  const isFree = orgProducts.length === 0;

  const planType = isEnterprise
    ? format('enterprise')
    : isStandard
    ? format('standard')
    : isFree
    ? format('free')
    : format('premium');

  return planType;
};
interface WorkspaceDetailProps {
  name?: string;
  displayName: string;
  userRelationshipToWorkspace: UserRelationshipToWorkspace;
  logoHash?: string | null;
  orgId?: string;
  toggleVisibility: () => void;
  orgProducts: number[];
}

export const WorkspaceDetail = ({
  name,
  displayName,
  logoHash,
  userRelationshipToWorkspace,
  orgId,
  toggleVisibility,
  orgProducts,
}: WorkspaceDetailProps) => {
  const handleWorkspaceClick = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'orgPageLink',
      source: 'currentWorkspaceNavigationDrawer',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  };

  // Don't link in the following cases:
  // * personal - does not have a team page
  // * guest - does not have access to the team page
  const LinkifyWorkspace = ({ children }: { children: JSX.Element }) =>
    userRelationshipToWorkspace === 'MEMBER' && name ? (
      <RouterLink
        className={styles.workspaceLink}
        href={`/${name}`}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={handleWorkspaceClick}
      >
        {children}
      </RouterLink>
    ) : (
      children
    );

  const workspacePlanType = getWorkspacePlanType(
    orgProducts,
    userRelationshipToWorkspace,
  );

  return (
    <>
      <div className={styles.workspaceDetail}>
        <LinkifyWorkspace>
          <WorkspaceLogo logoHash={logoHash} name={displayName} />
        </LinkifyWorkspace>
        <div className={styles.workspaceInfo}>
          <span className={styles.workspaceNameContainer}>
            <LinkifyWorkspace>
              <p className={styles.workspaceName}>{displayName}</p>
            </LinkifyWorkspace>
          </span>
          {!!workspacePlanType && (
            <p className={styles.workspacePlanType}>{workspacePlanType}</p>
          )}
        </div>
        <CollapseSidebarButton onClick={toggleVisibility} />
      </div>
    </>
  );
};
