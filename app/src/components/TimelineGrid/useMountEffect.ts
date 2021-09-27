import { useEffect } from 'react';

/**
 * The purpose of this hook is to run an effect only once.
 * This is achieved by providing an empty dep array to the
 * `useEffect` hook. This is a workaround for the lack of an
 * actual useMountEffect and hence the eslint around that rule is disabled.
 * https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once/56767883#56767883
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (func: () => void) => useEffect(func, []);
