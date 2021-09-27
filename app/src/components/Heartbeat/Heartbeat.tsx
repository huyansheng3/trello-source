import React, { FunctionComponent } from 'react';

import { default as AtlassianHeartbeat } from '@atlassian/heartbeat';
import { atlassianApiGateway } from '@trello/config';
import { useFeatureFlag } from '@trello/feature-flag-client';

interface HeartbeatProps {
  isAaMastered?: boolean;
}

export const Heartbeat: FunctionComponent<HeartbeatProps> = ({
  isAaMastered,
}) => {
  const apiBaseUrl = `${atlassianApiGateway}gateway/api`;
  const endpointUrl = `${apiBaseUrl}/session/heartbeat`;

  const isHeartbeatEnabled = useFeatureFlag(
    'aaaa.web.session-heartbeat',
    false,
  );

  if (!isAaMastered || !isHeartbeatEnabled) {
    return null;
  }
  return <AtlassianHeartbeat endpoint={endpointUrl} />;
};
