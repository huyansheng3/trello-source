import React, { createContext } from 'react';

interface VerticalScrollContextState {
  scrollContainer: HTMLDivElement | null;
}

export const VerticalScrollContext = createContext<VerticalScrollContextState>({
  scrollContainer: null,
});

interface VerticalScrollContextProviderProps {
  scrollContainer: HTMLDivElement | null;
}

// The point of this context is so we can record the
// element that handles the vertical scrolling.
// Using it, we can account for things like:
// - whether the scrollbars are shown (so we can adjust the
// fixed header labels)
// - whether using the mouse wheel to scroll vertically (so
// we can update the dragging and resizing state)
export const VerticalScrollContextProvider: React.FC<VerticalScrollContextProviderProps> = React.memo(
  ({ scrollContainer, children }) => {
    return (
      <VerticalScrollContext.Provider value={{ scrollContainer }}>
        {children}
      </VerticalScrollContext.Provider>
    );
  },
);
