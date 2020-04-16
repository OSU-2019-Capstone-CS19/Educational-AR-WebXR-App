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
    "revision": "6a8b9fe2575a72aecf7c240b6fac73f5"
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
    "url": "polyfills/dynamic-import.991be47e17117abb5eb15f5254ad3869.js",
    "revision": "08b86a7f56c6f0d65265654299b16d74"
  },
  {
    "url": "polyfills/webcomponents.d406f4685fdfb412c61f23b3ae18f2dc.js",
    "revision": "b1db7cb76380495a55ff4f65a9648f0e"
  },
  {
    "url": "solar-58fd4bb0.js",
    "revision": "ebf02d3c471b1ec3c80e01a22fdf488b"
  },
  {
    "url": "solarSystem.json",
    "revision": "d3a746f760fc4d58d74d55d1ec1392ef"
  },
  {
    "url": "src/solar.js",
    "revision": "fdf33080b406c7f8c026bd1579d39342"
  },
  {
    "url": "style.css",
    "revision": "9a99a0670ec5d5e58eae935d71db3d8c"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
