import { importWithRetry } from '@trello/use-lazy-component';

export const getVisitorId = async () => {
  // Get the visitor identifier when you need it.
  const { default: FingerprintJS } = await importWithRetry(
    () =>
      import(
        /* webpackChunkName: "fingerprint-js" */ '@fingerprintjs/fingerprintjs'
      ),
  );
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  // Remove components that are messing up the fingerprint in Safari and Brave
  const {
    audio,
    canvas,
    cookiesEnabled,
    deviceMemory,
    hardwareConcurrency,
    plugins,
    vendorFlavors,
    ...components
  } = result.components;

  // This is the visitor identifier:
  const visitorId = FingerprintJS.hashComponents({ ...components });
  return visitorId;
};
