# Dnyx Draft Configuration and Data Boundaries

This page documents the runtime, storage, dependency, Docker, and Cloudflare configuration used by Dnyx Draft, including the boundaries between client-side Markdown editing and optional network features.

## Browser Storage

| Key | Location | Purpose |
| :--- | :--- | :--- |
| Normal Workspace documents | Per-document `documents` metadata and `contents` records in browser IndexedDB | Normal Workspace content and document metadata, including local review threads. Content is loaded on demand. Secret and temporary share/live tabs are excluded. |
| `markdownViewerTabs` | Legacy `localStorage` value | Read once to migrate an older monolithic Workspace into per-document storage, then removed. |
| `markdownViewerDocumentOrganization` | IndexedDB metadata; also retained as a small compatibility preference | Workspace expansion state, nested non-secret folders, sidebar filter, sidebar width/collapse state, and last non-secret creation location. |
| `markdownViewerSecretWorkspace` | Small manifest in IndexedDB; encrypted records are stored separately | Secret Workspace files and folder names are encrypted per record with AES-GCM using a PBKDF2-SHA-256 password-derived key. The salt and non-sensitive counts are in the manifest; the key is session-only. |
| `markdownViewerActiveTab` | `localStorage` | Active tab id. |
| `markdownViewerUntitledCounter` | `localStorage` | Next Untitled document number. |
| `markdownViewerGlobalState` | `localStorage` | Theme, direction, view mode, scroll sync, and other global UI preferences. |
| `app-lang` | `localStorage` | Selected UI language. |
| `find-replace-docked` | `localStorage` | Find and Replace panel dock preference. |
| `markdownViewerPrivateMode` | `localStorage` | Whether new document-state persistence is paused. Existing saved documents are preserved. |

Temporary shared content is intentionally not persisted:

- Share Snapshot tabs have `kind: "share-snapshot"`.
- Live Share participant tabs use `kind: "live-share"` plus `temporary: true`; host documents are restored when leaving the session.

Private mode in Workspace settings pauses new document-state writes until the mode is turned off; it does not clear existing normal or Secret Workspace documents. **Storage and Backup** reports workspace usage, normal and secret document counts, the read-only browser persistence state, and exports/imports folder-preserving ZIP backups. Import replaces the current workspace after confirmation. Backups contain normal documents, organization, review data, selected preferences, and optional encrypted Secret Workspace records; trash and recovery journals remain outside the ZIP. Browser storage uses the browser's best-effort policy by default. **Reset workspace** permanently deletes documents, folders, settings, Secret Workspace ciphertext, history, and trash after confirmation.

## Client Libraries

The web build loads core libraries from CDN with Subresource Integrity where checked into `index.html`. Larger feature libraries are lazy-loaded from `script.js` only when needed.

| Library | Source | Used For | Load Behavior |
| :--- | :--- | :--- | :--- |
| Bootstrap | CDN | UI components | Initial page load |
| Bootstrap Icons | CDN | Icons | Initial page load |
| github-markdown-css | CDN | Preview styling | Initial page load |
| Marked | CDN | Markdown parsing | Initial page load and worker |
| Highlight.js | CDN | Code highlighting | Initial page load and worker |
| DOMPurify | CDN | HTML sanitization | Initial page load |
| FileSaver.js | CDN | Browser downloads | Initial page load |
| js-yaml | CDN | Frontmatter parsing | Initial page load |
| MathJax | CDN | LaTeX math | Lazy |
| Mermaid | CDN | Mermaid diagrams | Lazy |
| jsPDF | CDN | Legacy raster PDF | Lazy |
| html2canvas | CDN | PDF/PNG capture | Lazy |
| Pako | CDN | Share compression, diagram encoding | Lazy |
| JSZip | CDN | Workspace ZIP backup and import | Lazy |
| JoyPixels / emoji-toolkit | CDN | Emoji shortcodes | Lazy |
| ABCJS | CDN | ABC notation and playback | Lazy |
| Leaflet | CDN | GeoJSON/TopoJSON maps | Lazy |
| TopoJSON | CDN | TopoJSON conversion | Lazy |
| Three.js | CDN | STL 3D rendering | Lazy |
| STLLoader / OrbitControls | CDN | STL loading and controls | Lazy |
| D3 | CDN | Markmap | Lazy |
| Markmap | CDN | Markmap diagrams | Lazy |
| Yjs | CDN | Live Share document sync | Lazy |

## Rendering Thresholds and Limits

| Setting | Value |
| :--- | :--- |
| Large document threshold | 15,000 characters |
| Huge document threshold | 100,000 characters |
| Worker render threshold | 50,000 characters |
| Worker timeout | 12 seconds |
| Small render debounce | 100 ms |
| Large render debounce | 160 ms |
| Huge render debounce | 240 ms |
| Minimum split pane width | 20% |
| Line-height cache size | 5,000 entries |
| Local Markdown import | 10 MB per file |
| GitHub importer shown files | All Markdown files found |
| Saved GitHub access tokens | 50 named entries |
| GitHub access-token name | 60 characters |
| Share URL warning ceiling | 32,000 characters |
| Legacy share URL ceiling | 4,096 characters |
| Server share threshold | 3,000 bytes |
| Stored Share Snapshot max content | 8,000,000 characters |
| Stored Share Snapshot TTL | 90 days |
| Managed media max source file | 25 MiB |
| Managed still-image optimized payload | 300 KiB |
| Managed GIF payload | 5 MiB |
| Managed video payload | 10 MiB |
| Managed media TTL | 90 days from the most recent upload of that content |
| Live Share max participants | 64 |
| Live Share max message | 8 MB |
| STL source limit | 2 MiB |
| STL geometry limit | 300,000 vertices |

## Sanitization

The main preview path calls DOMPurify with additional tags and attributes needed by renderers:

- Additional tags include `mjx-container`, `input`, `video`, and `source`.
- Additional attributes include `id`, `class`, `style`, `align`, `type`, `checked`, `disabled`, `data-original-code`, `role`, `aria-labelledby`, `aria-describedby`, `aria-label`, `controls`, `preload`, and `playsinline`.
- Allowed URI schemes include HTTP(S), `mailto:`, `tel:`, `blob:`, relative URLs, safe non-script values, and base64 raster image data for AVIF, BMP, GIF, JPEG, PNG, and WebP. SVG data URLs remain blocked.

Export paths use similar expanded sanitizer settings for SVG/math capture. Scripts and unsafe event handlers are still removed.

Standalone HTML export also includes a restrictive CSP and SRI metadata for its external CSS and renderer scripts where applicable.

## Service Worker and PWA

`sw.js` uses a versioned cache name so stale caches can be retired safely.

Critical assets:

- `/`
- `/index.html`
- `/styles.css`
- `/script.js`
- `/preview-worker.js`
- `/manifest.json`
- `/assets/logo_trans.png`

Local shell assets use network-first behavior with cache fallback for update-sensitive paths. CDN assets from cdnjs and jsDelivr use cache-first behavior after first successful fetch. The service worker removes old `dnyx-draft-cache-*` caches on activation.

Service workers require HTTPS or localhost. They do not work from `file://`.

## Cloudflare Configuration

`wrangler.toml` configures the Pages project:

```toml
name = "dnyx-draft"
pages_build_output_dir = "."
compatibility_date = "2025-04-30"

[[kv_namespaces]]
binding = "SHARE_KV"
id = "c820d2705f5742858a27b91b88f544bd"

[[durable_objects.bindings]]
name = "LIVE_ROOMS"
class_name = "LiveRoom"
script_name = "dnyx-draft-live-room"
```

`SHARE_KV` stores large Share Snapshot records and content-addressed managed media for 90 days. Re-uploading identical content refreshes that media item's 90-day expiry. The snapshot and media record types use separate key prefixes. `LIVE_ROOMS` routes Live Share WebSocket rooms to Durable Objects.

Live Share does not persist Markdown or Review content server-side. Its Durable Object does persist the host, edit, and view bearer capability values plus `createdAt` under `live-room-auth-v1`; the current implementation defines no application TTL or deletion route for that record. Share Snapshot, managed media storage, and Live Share are separate data paths.

`wrangler.live-room.toml` deploys `workers/live-room-worker.js` with the `LiveRoom` Durable Object migration.

## Share API

`functions/api/share/[[id]].js` supports:

- `OPTIONS` for CORS preflight.
- `POST /api/share` to create a stored snapshot.
- `GET /api/share/<id>` to load a stored snapshot.
- `DELETE /api/share/<id>` to delete a stored snapshot when the creator supplies its deletion token.

Responses set `Cache-Control: no-store` and vary CORS by request origin. The allowed origins are the production app, HTTPS `*.dnyx-draft.pages.dev` previews, `null`, and localhost/127.0.0.1 development origins; unsupported origins receive `403`. Requests without an `Origin` header are accepted, so origin filtering is not an access-control substitute.

Stored records contain content, mode, title, creation time, size, and a hash of the creator deletion token. The token is returned only when the snapshot is created. The current UI does not display the token or expose a Delete snapshot action; API clients must capture the response to use early deletion. Invalid ids, missing content, oversized content, invalid deletion tokens, missing KV binding, and unknown routes return JSON errors. See [Share Snapshot](Share-Snapshot.md).

## Managed Media API

`functions/api/image/[[id]].js` and its video-friendly route alias `functions/api/media/[[id]].js` support:

- `POST /api/image` for AVIF, BMP, GIF, JPEG, PNG, and WebP data URLs.
- `POST /api/media` for MP4, WebM, and Ogg video data URLs.
- `GET` and `HEAD` on `/api/image/<id>` or `/api/media/<id>` to serve content through its content-addressed public URL.
- `OPTIONS` for CORS preflight.

The API accepts still images up to 300 KiB after client-side optimization, GIFs up to 5 MiB, and videos up to 10 MiB. It validates both the declared media type and file signature, derives an unguessable 24-character id from SHA-256 content, and stores the record in `SHARE_KV` with a 90-day TTL. Duplicate content returns the existing id and refreshes its TTL. Responses are public, immutable, and cross-origin until expiry; possession of the URL is sufficient to retrieve the media. This is the same 90-day retention duration used for stored Share Snapshot links, though the two features store separate records.

Upload and preflight requests use the same production, Cloudflare preview, local-file, and localhost origin checks as Share Snapshot.

## Live Room API

`functions/live-room/[[room]].js` supports WebSocket upgrades only. It validates the WebSocket `Origin`, room and secret length, requires `LIVE_ROOMS`, and forwards to a Durable Object chosen by `roomName + ":" + secret`. The Durable Object authenticates host, edit, and view capabilities, filters message types by role, enforces the participant/message limits, and persists the capability record described above.

See [Live Share](Live-Share-Cloudflare.md) for runtime flow and limits.

## Docker and Nginx

The root Docker build serves static files with Nginx on port 80. The repository includes `docker-compose.yml` exposing `8080:80`.

Security headers configured in Docker/Nginx documentation include:

- `Strict-Transport-Security` (Cloudflare Pages)
- `Content-Security-Policy`
- `X-Frame-Options: DENY` (Cloudflare Pages; the Docker image has its own Nginx policy)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`

Cloudflare Pages reads the root `_headers` and `_redirects` files. `_redirects` hides `.env`, `_headers`, and source-map paths behind 404 responses. Self-hosters should preserve equivalent policies and make sure `workspace-storage.js`, `preview-worker.js`, `sample.md`, `sw.js`, `manifest.json`, `script.js`, `styles.css`, `assets/`, `workers/`, and `functions/` or their Cloudflare equivalents are deployed according to the features they intend to use.

The checked-in root Dockerfile does not copy `preview-worker.js` or `sample.md`; see [Docker Deployment: Known Stock Image Limitation](Docker-Deployment.md#known-stock-image-limitation).

Related pages: [Installation](Installation.md), [Privacy and Security](Privacy-and-Security.md), [Share Snapshot](Share-Snapshot.md), [Live Share](Live-Share-Cloudflare.md), and [Troubleshooting](Troubleshooting.md).
