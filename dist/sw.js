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
    "revision": "b0453fd48fcd6a905449ec89c3b9061a"
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
    "url": "Quiz.css",
    "revision": "84675c90b7ac1952b6f44ca56da9446b"
  },
  {
    "url": "Quiz.html",
    "revision": "53d05c8edf33ca409ae26e5c1d4e179f"
  },
  {
    "url": "solar-aeca48a6.js",
    "revision": "6e667469ef8ede148abe55368da1eb4f"
  },
  {
    "url": "src/Quiz.js",
    "revision": "9036b727e438622188198b1d526ff2e6"
  },
  {
    "url": "src/solar.js",
    "revision": "9ded72220e669469c14c0a68d966f56a"
  },
  {
    "url": "style.css",
    "revision": "77f5152b616326d985bdad18f9d87812"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
87573a8db3553481c0fa4f5e555"
  },
  {
    "url": "model/UI-Textures/Lines.png",
    "revision": "9c09c34c90cd52f5d0dfac959bda7895"
  },
  {
    "url": "model/UI-Textures/Mars.png",
    "revision": "c88cc845ec571b88f7cfcae7b52126db"
  },
  {
    "url": "model/UI-Textures/Mercury.png",
    "revision": "a88d9189b78dd5ceb5dab55a8d91bef4"
  },
  {
    "url": "model/UI-Textures/Moon.png",
    "revision": "266a7623094381aaa23278dd8bf14834"
  },
  {
    "url": "model/UI-Textures/Neptune.png",
    "revision": "fc7697d2e11705b8a79c5685d4c4eac4"
  },
  {
    "url": "model/UI-Textures/Orbit-Speed.png",
    "revision": "7646adb58b1ebea73b3a1441205ac241"
  },
  {
    "url": "model/UI-Textures/pause-play.png",
    "revision": "001f6c821eee711e2b4b8315272d8977"
  },
  {
    "url": "model/UI-Textures/pause.png",
    "revision": "d4204595235cfea2c803d31fb043072b"
  },
  {
    "url": "model/UI-Textures/Planets.png",
    "revision": "b7046470583fce4828c313a471667582"
  },
  {
    "url": "model/UI-Textures/play.png",
    "revision": "473a621419e3fb5e49a078374c7ed7c5"
  },
  {
    "url": "model/UI-Textures/Pluto.png",
    "revision": "a8d3641529e6bb7f80eb09e8b9ebf538"
  },
  {
    "url": "model/UI-Textures/Reset.png",
    "revision": "12d060fbbebef0271e31db13ac5d5130"
  },
  {
    "url": "model/UI-Textures/return-to-origin.png",
    "revision": "5a4e85e68cb68b42fa6704c961fb7e84"
  },
  {
    "url": "model/UI-Textures/Rotate-Speed.png",
    "revision": "5593c5f8ec3643fc0e44264d7c1b73ba"
  },
  {
    "url": "model/UI-Textures/Saturn.png",
    "revision": "0f32c91c16550e9b5f38210ccbc9b541"
  },
  {
    "url": "model/UI-Textures/Sun.png",
    "revision": "3d7ba44a0077b5e0081a6d1e0649f784"
  },
  {
    "url": "model/UI-Textures/Uranus.png",
    "revision": "fbe8b5a34ac411abcc59e7f557a9d8a4"
  },
  {
    "url": "model/UI-Textures/Venus.png",
    "revision": "f902d82fd0203530e1f1892d3ea7e749"
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
    "url": "Quiz.css",
    "revision": "84675c90b7ac1952b6f44ca56da9446b"
  },
  {
    "url": "Quiz.html",
    "revision": "53d05c8edf33ca409ae26e5c1d4e179f"
  },
  {
    "url": "solar-aeca48a6.js",
    "revision": "6e667469ef8ede148abe55368da1eb4f"
  },
  {
    "url": "solarSystem.json",
    "revision": "35c3fabf08556ec2827dbadd68818e64"
  },
  {
    "url": "src/Quiz.js",
    "revision": "9036b727e438622188198b1d526ff2e6"
  },
  {
    "url": "src/solar.js",
    "revision": "9ded72220e669469c14c0a68d966f56a"
  },
  {
    "url": "style.css",
    "revision": "77f5152b616326d985bdad18f9d87812"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
