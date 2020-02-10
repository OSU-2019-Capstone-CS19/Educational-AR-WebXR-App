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
    "revision": "00f3383211d2d6c5d410b57dc9f0138b"
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
    "url": "polyfills/webcomponents.d406f4685fdfb412c61f23b3ae18f2dc.js",
    "revision": "b1db7cb76380495a55ff4f65a9648f0e"
  },
  {
    "url": "solar-77b202f8.js",
    "revision": "0d74d8e0b419880ab9ba486bc763b946"
  },
  {
    "url": "src/menuEventHandler.js",
    "revision": "77099a211d999429a9a73cd672c976ba"
  },
  {
    "url": "src/render.js",
    "revision": "5cc34e971a5c55f05a06ad5cf00f9e5b"
  },
  {
    "url": "src/sceneEventHandler.js",
    "revision": "b4c988c47bcdacb562ca422f18a80a99"
  },
  {
    "url": "src/solar.js",
    "revision": "e9ad700215b247ab53bc290d8276ae03"
  },
  {
    "url": "style.css",
    "revision": "a8c9c8f9cdb280da77523b371625fbf1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
