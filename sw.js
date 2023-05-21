(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.3"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.3"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}(()=>{s(913);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[t.prefix,e,t.suffix].filter((e=>e&&e.length>0)).join("-"),n=e=>e||a(t.precache);function r(e,t){const s=t();return e.waitUntil(s),s}function i(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:a}=t;if(!a)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),r=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:r.href}}s(977);class c{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class o{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let h;function l(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class u{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const d=new Set;function f(e){return"string"==typeof e?new Request(e):e}s(873);class p{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let a=f(t);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=f(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(t,s){const a=f(t);await(0,new Promise((e=>setTimeout(e,0))));const n=await this.getCacheKey(a,"write");if(!s)throw new e("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(s);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),p=u?await async function(e,t,s,a){const n=l(t.url,s);if(t.url===n)return e.match(t,a);const r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const t of i)if(n===l(t.url,s))return e.match(t,a)}(h,n.clone(),["__WB_REVISION__"],o):null;try{await h.put(n,u?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:p,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=f(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class g{constructor(e={}){this.cacheName=e.cacheName||a(t.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new p(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(t,s,a){let n;await t.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,t),!n||"error"===n.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(n=await r({error:e,event:a,request:s}),n)break;if(!n)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))n=await e({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}class y extends g{constructor(e={}){e.cacheName=n(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(y.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=n.integrity,r=t.integrity,i=!r||r===e;a=await s.fetch(new Request(t,{integrity:"no-cors"!==t.mode?r||e:void 0})),e&&i&&"no-cors"!==t.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await s.cachePut(t,a.clone()))}return a}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(t);if(!await s.cachePut(t,a.clone()))throw new e("bad-precaching-response",{url:t.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==y.copyRedirectedCacheableResponsesPlugin&&(a===y.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(y.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}y.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},y.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let a=null;if(t.url&&(a=new URL(t.url).origin),a!==self.location.origin)throw new e("cross-origin-copy-response",{origin:a});const n=t.clone(),r={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=s?s(r):r,c=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?n.body:await n.blob();return new Response(c,i)}(t):t};class w{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new y({cacheName:n(e),plugins:[...t,new o({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const a of t){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:t,url:n}=i(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:t});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==a.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(t,a.integrity)}if(this._urlsToCacheKeys.set(n,t),this._urlsToCacheModes.set(n,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return r(e,(async()=>{const t=new c;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return r(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let m;const _=()=>(m||(m=new w),m);s(80);const R=e=>e&&"object"==typeof e?e:{handle:e};class v{constructor(e,t,s="GET"){this.handler=R(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=R(e)}}class C extends v{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class b{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(n)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,R(e))}setCatchHandler(e){this._catchHandler=R(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let q;class U extends v{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(n);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var L;L=[{'revision':'03224061021e8b395dc549faf92d51d8','url':'assets/A.png'},{'revision':'e585e7d71da64957474937c39475d4ff','url':'assets/B.png'},{'revision':'71be66ef58e8f5e400f6bac5f2f1739b','url':'assets/C.png'},{'revision':'737a44fafcca5123c9a70b3358e4f911','url':'assets/S.png'},{'revision':'a7de6b8e590d3a9cf58fca0ea4e06161','url':'assets/assist-icon.png'},{'revision':'38e8a15919ad4c5f4697bf73af6df223','url':'assets/assist.png'},{'revision':'de401f64f61b3132d3887e88af69fe44','url':'assets/audio/confirm.mp3'},{'revision':'2d7b04ecbef3d7cc9ad12d59af3d936f','url':'assets/audio/feh disabled unit.mp3'},{'revision':'91e34a409141710475d44d4847072520','url':'assets/audio/feh enabled unit.mp3'},{'revision':'a91fa945ce9343d69eebe7a693375d15','url':'assets/audio/hit.mp3'},{'revision':'df392e33a3df426df1dd9049d5624b5c','url':'assets/audio/hover on tile.mp3'},{'revision':'164d54c534558af52d8b2a1e93af9d5a','url':'assets/audio/ko.mp3'},{'revision':'3645879e7f949196ba42a5b9c02ecdad','url':'assets/audio/leif's army in search of victory.ogg'},{'revision':'853ed9479605f3de9435e206b6838a99','url':'assets/audio/pointer-tap.mp3'},{'revision':'0f393f540894f957ef14d0c94177bf59','url':'assets/audio/quotes/Corrin.json'},{'revision':'460203a36ca11e313be7dfd9a4148d98','url':'assets/audio/quotes/Corrin.m4a'},{'revision':'ac64dd9fe65598da7c64ab47742de488','url':'assets/audio/quotes/Ephraim.json'},{'revision':'566f9c543458d7e1775f2223a668df1c','url':'assets/audio/quotes/Ephraim.m4a'},{'revision':'cf2a271471b4af5d698b9a8eeddbba3b','url':'assets/audio/quotes/Hector.json'},{'revision':'b3efa9127c68c242cd0de2a7224c7942','url':'assets/audio/quotes/Hector.m4a'},{'revision':'8f433c5ed2cf6d379585a60e03b6d561','url':'assets/audio/quotes/Ike.json'},{'revision':'0b3debc9c7de54a1ec94da14262c3e19','url':'assets/audio/quotes/Ike.m4a'},{'revision':'26ea043a6ab7f0236e0a61bb5dff9560','url':'assets/audio/quotes/Lucina.json'},{'revision':'1ae3994a81a09373872447868311bfaa','url':'assets/audio/quotes/Lucina.m4a'},{'revision':'0cfff68eaa274391f93b10c3e0d06c84','url':'assets/audio/quotes/Lyn.json'},{'revision':'49e1c2f81d388e09ee43f99c045b717b','url':'assets/audio/quotes/Lyn.m4a'},{'revision':'dbc97afb9bdcca18204e2ecf8a5bd705','url':'assets/audio/quotes/Robin.json'},{'revision':'888046eb57c326955ea6b05f24521d93','url':'assets/audio/quotes/Robin.m4a'},{'revision':'5367c32fa533e43aaed6d28cb49df1ee','url':'assets/audio/quotes/Ryoma.json'},{'revision':'089852dd13e288d8b76140307f2860f6','url':'assets/audio/quotes/Ryoma.m4a'},{'revision':'349ff17d38c611ab57a826e2a9819d24','url':'assets/battle/Corrin.json'},{'revision':'29ad7621f3318ce48046c64a7cc5a91d','url':'assets/battle/Corrin.webp'},{'revision':'4cdcd2466dc2d166b79a00b224ffc727','url':'assets/battle/Ephraim.json'},{'revision':'7ce51e1e692307232210644fb027d83d','url':'assets/battle/Ephraim.webp'},{'revision':'1fcddc1084a50b31eb69392aade78333','url':'assets/battle/Hector.json'},{'revision':'811c56b2b1a661c0c67de217551736de','url':'assets/battle/Hector.webp'},{'revision':'f37e3b7d13e8e289a49b3f54466f34f5','url':'assets/battle/Ike.json'},{'revision':'7451ffb287a7f25039ccb99f305e46e6','url':'assets/battle/Ike.webp'},{'revision':'3a7c4d542996668e105acdb0210d6978','url':'assets/battle/Lucina.json'},{'revision':'af6e947e012a19d7ccb6c855875bcaab','url':'assets/battle/Lucina.webp'},{'revision':'9c9e1207d6c0ad382e5677dfcf0cac80','url':'assets/battle/Lyn.json'},{'revision':'ec7df77eea46c7db9dcc45c83a6ea94b','url':'assets/battle/Lyn.webp'},{'revision':'8373f5a073494233da43416f39e86a81','url':'assets/battle/Robin.json'},{'revision':'f0dbb9c991265bff23398131ddb790fa','url':'assets/battle/Robin.webp'},{'revision':'0155df522e387c9a14ffcb9b90debe3c','url':'assets/battle/Ryoma.json'},{'revision':'ee0759b0614f83ffd6f8fe2842f0cd82','url':'assets/battle/Ryoma.webp'},{'revision':'a02d0be35368afb12e439cf8d449d71c','url':'assets/battle/no-unit.jpg'},{'revision':'beffbe467a4418bc58c58a46829493fc','url':'assets/buff-arrow.png'},{'revision':'699a2b71a700124c5c83d117593ee1df','url':'assets/debuff-arrow.png'},{'revision':'e8fa9d8d3b5937eae54ee7eeaf76b253','url':'assets/effective-against-enemy.png'},{'revision':'374d0e81a2948787cdd8b883b2b00df6','url':'assets/end-arrow-fixed.png'},{'revision':'c1ae90b85b054f6648d6aa050936e31f','url':'assets/end-arrow.png'},{'revision':'87ff1e47796c2b5cb7db6b4ea8bcc3c5','url':'assets/enemy-effective.png'},{'revision':'556a047585e1efdae3e5da5437547e70','url':'assets/horizontal.png'},{'revision':'8d14cc97622c8a573f0de5cd5b4017b2','url':'assets/hp plate.png'},{'revision':'8c5856ec00b96328b081af00e10b83e6','url':'assets/increased-mobility.png'},{'revision':'89793e06a9fd69aa5ceb46eee54b0fed','url':'assets/interaction-attack.png'},{'revision':'a59addbc2c8ee29c37c53809396fd1ff','url':'assets/interaction-bubble.png'},{'revision':'3646ed7e8616c34406b7583e4e3de1b7','url':'assets/map.webp'},{'revision':'5c86f846758cb6142e98bee034e59e04','url':'assets/movement-allowed.png'},{'revision':'ab6322f70daed65fc0f01b66ec6c946b','url':'assets/nameplate.png'},{'revision':'91d52aea1dfa9e04ec132e869a575a40','url':'assets/path-down-left.png'},{'revision':'290403445d8e18e61622ac41d5836d0b','url':'assets/path-down-right.png'},{'revision':'dc79ed94444772de83c2b50356922465','url':'assets/path-up-left.png'},{'revision':'b34a369c4a6d8182e41f1ecf6358999c','url':'assets/path-up-right.png'},{'revision':'58c6bb1c922890bcc65fde33b752bd8a','url':'assets/rosary-arrow.png'},{'revision':'9de24a9f0bdf724dcda423a965c8aca5','url':'assets/rosary-current.png'},{'revision':'bb038726b9518b9fc78fb327c6d9f970','url':'assets/sheets/skills.json'},{'revision':'ec5ecd54d714513dc4dd59768048fbd2','url':'assets/sheets/skills.png'},{'revision':'5a53fedf8e38b8c2e3e54efa137bf440','url':'assets/sheets/skills.webp'},{'revision':'690c27c299c3831fcb957171206dbc4f','url':'assets/sheets/weapons.json'},{'revision':'e4acd3ed6bbfddb71deef44f898726d4','url':'assets/sheets/weapons.webp'},{'revision':'0a7337a344c3828634aa402a289e7065','url':'assets/special-icon.png'},{'revision':'5c45ac4df30f128d7956d68b7a923c61','url':'assets/sqq.png'},{'revision':'14828f7d80fbd32eac25c3615270759c','url':'assets/stat-glowing-line.png'},{'revision':'d3c45dbf40f2f24582c01256a531dcdf','url':'assets/two unit screen.png'},{'revision':'4c2fd1929eca5723c03cd99ddb97de1c','url':'assets/ui.png'},{'revision':'f0a1b77ef4fef796b0cd46c15c55f873','url':'assets/unit battle.png'},{'revision':'5d349917698dbb73900760d3bf865adf','url':'assets/unit-bg-test.png'},{'revision':'95e9651386e6ea533c839c9aa7741b82','url':'assets/unitbg.png'},{'revision':'4614a6063acfd7d89c78fe65daef0d43','url':'assets/vertical-fixed.png'},{'revision':'cdd1f0cf77e2aed9906253c0e3f4b755','url':'assets/vertical.png'},{'revision':'8e268fb2ed1b135da1dcbae817f22feb','url':'assets/weapon.png'},{'revision':'3654836765b0fd8510d9e7f22a3273c3','url':'assets/weapon_icon.png'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'86f9d3233946ee4875ed3304658a1ee6','url':'index.html'},{'revision':null,'url':'main.20f8c7ce823d7a226dc0.bundle.js'},{'revision':'bce522c56cb3f14ea2e70f00ad566f9d','url':'main.20f8c7ce823d7a226dc0.bundle.js.LICENSE.txt'},{'revision':'bf38d0c9760162342f12cd9b44fbf4ef','url':'manifest.json'},{'revision':null,'url':'vendors.f6ef3e7f3cd126227ead.bundle.js'},{'revision':'fbc1173afdd4de88faa77d1382453c93','url':'vendors.f6ef3e7f3cd126227ead.bundle.js.LICENSE.txt'}],_().precache(L),function(t){const s=_();!function(t,s,a){let n;if("string"==typeof t){const e=new URL(t,location.href);n=new v((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)n=new C(t,s,a);else if("function"==typeof t)n=new v(t,s,a);else{if(!(t instanceof v))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=t}(q||(q=new b,q.addFetchListener(),q.addCacheListener()),q).registerRoute(n)}(new U(s,t))}(undefined)})()})();