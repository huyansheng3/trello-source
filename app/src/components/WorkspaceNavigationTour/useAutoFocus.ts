import { MutableRefObject, useEffect } from 'react';

export const useAutoFocus = (
  el: MutableRefObject<HTMLElement | null>,
  isOpen?: boolean,
) => {
  useEffect(() => {
    if (isOpen) {
      el.current?.focus();
    }
  }, [el, isOpen]);
};
