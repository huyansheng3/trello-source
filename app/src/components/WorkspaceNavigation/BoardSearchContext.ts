import React from 'react';

export const BoardSearchContext = React.createContext({
  query: '',
  setQuery: (_: string) => {},
});
