import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styles from './WorkspaceLogo.less';
import { logoDomain } from '@trello/config';
import { WorkspaceDefaultLogo } from './WorkspaceDefaultLogo';
import { forTemplate } from '@trello/i18n';
import { OrganizationIcon } from '@trello/nachos/icons/organization';

const format = forTemplate('workspace_navigation');
type Size = 'small' | 'medium';

export const WorkspaceLogo = ({
  logoHash,
  name,
  size,
}: {
  logoHash?: string | null;
  name?: string | null;
  size?: Size;
}) => {
  // .gif files have to be accessed with the .gif extension
  // we try to load the logoHash with the .png extension, if that fails
  // we try again with the .gif extension, if that fails, we show
  // the default logo
  const [showPNG, setShowPNG] = useState(true);
  const [showDefaultLogo, setShowDefaultLogo] = useState(false);
  const logoExt = showPNG ? 'png' : 'gif';

  // reset the state whenever logoHash changes
  useEffect(() => {
    setShowPNG(true);
    setShowDefaultLogo(false);
  }, [logoHash]);

  const handleImageError = useCallback(() => {
    // if we're current trying the .png exention, try .gif
    // if we're trying .gif, fallback to default logo
    showPNG ? setShowPNG(false) : setShowDefaultLogo(true);
  }, [showPNG, setShowPNG, setShowDefaultLogo]);

  return (
    <div
      className={classnames(styles.logoContainer, {
        [styles.smallLogoContainer]: size !== 'medium',
        [styles.mediumLogoContainer]: size === 'medium',
      })}
    >
      {logoHash && !showDefaultLogo ? (
        <img
          className={styles.workspaceLogo}
          src={`${logoDomain}/${logoHash}/30.${logoExt}`}
          srcSet={`${logoDomain}/${logoHash}/30.${logoExt} 1x, ${logoDomain}/${logoHash}/170.${logoExt} 2x`}
          alt={format('logo-for-team', { name: name || '' })}
          onError={handleImageError}
        />
      ) : // WorkspaceDefaultLogo uses the first letter of the name
      // if that's not present, just show the organization icon
      name ? (
        <WorkspaceDefaultLogo name={name} />
      ) : (
        <OrganizationIcon />
      )}
    </div>
  );
};
