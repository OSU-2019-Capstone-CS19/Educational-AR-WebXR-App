/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "e1877f797cd42953b61b3a722d8aa5cf"
  },
  {
    "url": "model/planets-glb/neptune/Neptune.glb",
    "revision": "b22fc6c5706582d982eb867be9c19159"
  },
  {
    "url": "model/planets-glb/uranus/Uranus.glb",
    "revision": "82af7750084d9c843eec63a5655eaced"
  },
  {
    "url": "model/planets-glb/venus/Venus.glb",
    "revision": "97df6b856aabf83f455d10884bf1f7f1"
  },
  {
    "url": "polyfills/custom-elements-es5-adapter.84b300ee818dce8b351c7cc7c100bcf7.js",
    "revision": "cff507bc95ad1d6bf1a415cc9c8852b0"
  },
  {
    "url": "polyfills/dynamic-import.b745cfc9384367cc18b42bbef2bbdcd9.js",
    "revision": "ed55766050be285197b8f511eacedb62"
  },
  {
    "url": "polyfills/webcomponents.d67d6757b8cd44bc35b021ee0b71d197.js",
    "revision": "e90bc4e3aa3ed407808c7b2726581d33"
  },
  {
    "url": "solar-22318e52.js",
    "revision": "e2b4bb49147d182324b19b17df7111aa"
  },
  {
    "url": "solarSystem.json",
    "revision": "cc0ee8bc5ad63551bdde8b916b16945f"
  },
  {
    "url": "src/solar.js",
    "revision": "8ad7d3aee4c1942897351e9893468771"
  },
  {
    "url": "style.css",
    "revision": "698b0960afaaf3a1d8fb020f0f16f258"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
