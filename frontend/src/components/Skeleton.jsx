// src/components/Skeleton.jsx
// Reusable animated placeholder for loading states.
// Inject the keyframe once via a shared style tag.

const SKELETON_CSS_ID = 'ws-skeleton-css';

function ensureCSS() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SKELETON_CSS_ID)) return;
  const el = document.createElement('style');
  el.id = SKELETON_CSS_ID;
  el.textContent = `
    @keyframes ws-skeleton-pulse {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1;   }
    }
    .ws-skeleton {
      background:        #1e2433;
      animation:         ws-skeleton-pulse 1.5s ease-in-out infinite;
      display:           inline-block;
      vertical-align:    middle;
      flex-shrink:       0;
    }
  `;
  document.head.appendChild(el);
}

/**
 * Animated grey bar for loading placeholders.
 *
 * @param {string|number} width        - CSS width  (default "100%")
 * @param {string|number} height       - CSS height (default 14)
 * @param {string|number} borderRadius - CSS border-radius (default 4)
 * @param {object}        style        - Extra inline styles (optional)
 * @param {string}        className    - Extra class names (optional)
 */
export default function Skeleton({
  width        = '100%',
  height       = 14,
  borderRadius = 4,
  style        = {},
  className    = '',
}) {
  ensureCSS();

  const w = typeof width  === 'number' ? `${width}px`  : width;
  const h = typeof height === 'number' ? `${height}px` : height;
  const r = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <div
      className={`ws-skeleton ${className}`.trim()}
      style={{ width: w, height: h, borderRadius: r, ...style }}
      aria-hidden="true"
    />
  );
}

// ─── Convenience compound components ─────────────────────────────────────────

/** Two-column skeleton row (label left, value right) */
export function SkeletonStatRow({ mb = 12 }) {
  ensureCSS();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: mb }}>
      <Skeleton width="42%" height={12} />
      <Skeleton width="25%" height={12} />
    </div>
  );
}

/** Full-width block with optional label above */
export function SkeletonBlock({ w = '100%', h = 14, mb = 10 }) {
  return <Skeleton width={w} height={h} style={{ marginBottom: mb }} />;
}

/** News / list item row */
export function SkeletonNewsRow({ mb = 14 }) {
  ensureCSS();
  return (
    <div style={{ marginBottom: mb }}>
      <Skeleton width="90%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="50%" height={10} />
    </div>
  );
}

/** Card placeholder with image area + text lines */
export function SkeletonCard() {
  ensureCSS();
  return (
    <div style={{ background: '#0f1117', border: '1px solid #1e2433', borderRadius: 8, overflow: 'hidden' }}>
      <Skeleton width="100%" height={180} borderRadius={0} />
      <div style={{ padding: '16px 18px' }}>
        <Skeleton width="30%" height={10} style={{ marginBottom: 10 }} />
        <Skeleton width="90%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="70%" height={14} style={{ marginBottom: 14 }} />
        <Skeleton width="80%" height={11} style={{ marginBottom: 5 }} />
        <Skeleton width="60%" height={11} />
      </div>
    </div>
  );
}

/** Horizontal compare bar row */
export function SkeletonCompareRow() {
  ensureCSS();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 20px', borderBottom: '1px solid rgba(30,36,51,0.5)' }}>
      <div style={{ flex: 1 }}>
        <Skeleton width="55%" height={14} style={{ marginLeft: 'auto', marginBottom: 6 }} />
        <Skeleton width="100%" height={5} />
      </div>
      <div style={{ width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <Skeleton width={20} height={20} borderRadius="50%" />
        <Skeleton width={70} height={8} />
      </div>
      <div style={{ flex: 1 }}>
        <Skeleton width="50%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="100%" height={5} />
      </div>
    </div>
  );
}