/* eslint-disable @trello/disallow-filenames */
import React from 'react';

// https://github.com/recharts/recharts/issues/1767
export const ResponsiveContainerWrapper: React.FunctionComponent = ({
  children,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
