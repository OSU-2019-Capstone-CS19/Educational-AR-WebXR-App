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
    "revision": "27e6c4bc0a283d855d3b6ceb0ea38513"
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
    "url": "model/UI-Textures/Anchor.png",
    "revision": "72bf2ed24891dc38083fd1992420ff6d"
  },
  {
    "url": "model/UI-Textures/Cam-Light.png",
    "revision": "ac374b0d18c25792268cd3ae5b232e9d"
  },
  {
    "url": "model/UI-Textures/drawer-icon.png",
    "revision": "9b5623876933ebae576fa13de8766eb1"
  },
  {
    "url": "model/UI-Textures/Earth.png",
    "revision": "c040c7564275db44fbd04c0652594aa1"
  },
  {
    "url": "model/UI-Textures/Jupiter.png",
    "revision": "1292c4c4b72e01f93abaf8ce14685586"
  },
  {
    "url": "model/UI-Textures/Light.png",
    "revision": "1406d142d37652e10406f1b95c0ad2d8"
  },
  {
    "url": "model/UI-Textures/Lines.png",
    "revision": "727adaabd7f1979c1c05dc3526b46d68"
  },
  {
    "url": "model/UI-Textures/Mars.png",
    "revision": "d3832b283eb77673a3831bdd1bb5c6ea"
  },
  {
    "url": "model/UI-Textures/Mercury.png",
    "revision": "27ab3335ad063082d278b350dace425f"
  },
  {
    "url": "model/UI-Textures/Moon.png",
    "revision": "9b575a9e6551901c531a0d9e650e838f"
  },
  {
    "url": "model/UI-Textures/Neptune.png",
    "revision": "06af665e5d658c8d6e664d0d3bbd7d27"
  },
  {
    "url": "model/UI-Textures/pause-play.png",
    "revision": "001f6c821eee711e2b4b8315272d8977"
  },
  {
    "url": "model/UI-Textures/Planets.png",
    "revision": "09cc4362dfe53fb8138ca8bba18a57bb"
  },
  {
    "url": "model/UI-Textures/Pluto.png",
    "revision": "641031985f3cb734855c6cc2ae372d16"
  },
  {
    "url": "model/UI-Textures/Reset.png",
    "revision": "591b37c0af23662ef6fc3a1ca45b66a3"
  },
  {
    "url": "model/UI-Textures/Saturn.png",
    "revision": "c84134fd049487ec76ba137428ec63d8"
  },
  {
    "url": "model/UI-Textures/Sun.png",
    "revision": "3212ec6e215f0d4b3fdf1bed42c13d43"
  },
  {
    "url": "model/UI-Textures/Uranus.png",
    "revision": "87bf8a945d827e342e90d63ba1be4100"
  },
  {
    "url": "model/UI-Textures/Venus.png",
    "revision": "629707f26f0c99e8f95940a6057dbe04"
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
    "url": "Quiz.css",
    "revision": "2b5da929cc5f4529aa0ed864b91df82f"
  },
  {
    "url": "Quiz.html",
    "revision": "d476314d320027126a7a84909b740f48"
  },
  {
    "url": "solar-6b205d73.js",
    "revision": "5e56e45880da1139d3343a119c6f1759"
  },
  {
    "url": "solarSystem.json",
    "revision": "c55a3ab4b4452794fe5672431c2068dc"
  },
  {
    "url": "src/Quiz.js",
    "revision": "06a3ffb9b8407c621ce9397fabf25afc"
  },
  {
    "url": "src/solar.js",
    "revision": "00fea63606943dc18a7e144a28a1761d"
  },
  {
    "url": "style.css",
    "revision": "77f5152b616326d985bdad18f9d87812"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
