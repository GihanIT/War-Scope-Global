// src/components/AlliancePanel.jsx
// Floating panel with alliance toggles — sits over the globe

import { useState } from 'react';
import { ALLIANCES } from '../data/alliance-data.js';

const PANEL_CSS = `
  @keyframes alliance-slide-in {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .alliance-panel { animation: alliance-slide-in 260ms ease both; }

  .alliance-btn {
    width: 100%; background: none; border: none; cursor: pointer;
    padding: 10px 14px; display: flex; align-items: center; gap: 10px;
    text-align: left; transition: all 160ms; border-radius: 6px;
    border: 1px solid transparent;
  }
  .alliance-btn:hover { background: rgba(255,255,255,0.04); }
  .alliance-btn.active { border-color: var(--ac); background: rgba(var(--acr), 0.08); }

  .alliance-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    transition: box-shadow 200ms;
  }
  .alliance-btn.active .alliance-dot {
    box-shadow: 0 0 8px var(--ac), 0 0 16px var(--ac);
  }

  .alliance-name {
    font-family: 'IBM Plex Mono', monospace; font-size: 12px;
    font-weight: 600; letter-spacing: 0.08em; color: #e8eaf0;
    flex: 1;
  }
  .alliance-count {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    color: #8892a4; flex-shrink: 0;
  }
  .alliance-btn.active .alliance-name { color: var(--ac); }
  .alliance-btn.active .alliance-count { color: var(--ac); opacity: 0.7; }

  .member-tags {
    display: flex; flex-wrap: wrap; gap: 4px;
    padding: 8px 14px 10px 34px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .member-tag {
    font-family: 'IBM Plex Mono', monospace; font-size: 9px;
    padding: 2px 6px; border-radius: 2px; letter-spacing: 0.06em;
    background: rgba(255,255,255,0.06); color: #8892a4;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .member-tag.highlight { background: rgba(var(--acr),0.15); color: var(--ac); border-color: rgba(var(--acr),0.3); }
`;

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export default function AlliancePanel({ activeAllianceId, onToggle, onClose }) {
  const [expanded, setExpanded] = useState(null);

  const active = ALLIANCES.find(a => a.id === activeAllianceId);

  return (
    <>
      <style>{PANEL_CSS}</style>
      <div
        className="alliance-panel"
        style={{
          position: 'absolute', top: 60, left: 16, zIndex: 20,
          width: 280,
          background: 'rgba(5,5,8,0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '12px 14px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,212,255,0.12)',
          background: 'rgba(0,212,255,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>🤝</span>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              letterSpacing: '0.14em', color: '#00d4ff', textTransform: 'uppercase', fontWeight: 600,
            }}>Alliance Map</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#8892a4', fontSize: 16, lineHeight: 1, padding: 4,
            transition: 'color 150ms',
          }}
          onMouseEnter={e => e.target.style.color='#e8eaf0'}
          onMouseLeave={e => e.target.style.color='#8892a4'}
          >✕</button>
        </div>

        {/* Active alliance info bar */}
        {active && (
          <div style={{
            padding: '10px 14px',
            background: `rgba(${hexToRgb(active.color)},0.08)`,
            borderBottom: `1px solid rgba(${hexToRgb(active.color)},0.2)`,
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: 10, color: active.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              ACTIVE · {active.name} · {active.members.length} members
            </div>
            <div style={{ fontSize: 12, color: '#8892a4', lineHeight: 1.5 }}>{active.description}</div>
            <div style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: 10, color: '#8892a4', marginTop: 6 }}>
              Founded {active.founded} · HQ: {active.hq}
            </div>
          </div>
        )}

        {/* Alliance list */}
        <div style={{ padding: '8px 8px', maxHeight: 420, overflowY: 'auto' }}>
          {ALLIANCES.map(alliance => {
            const isActive  = activeAllianceId === alliance.id;
            const isExpanded = expanded === alliance.id;
            const acr = hexToRgb(alliance.color);

            return (
              <div key={alliance.id}>
                <button
                  className={`alliance-btn ${isActive ? 'active' : ''}`}
                  style={{ '--ac': alliance.color, '--acr': acr }}
                  onClick={() => {
                    onToggle(alliance.id);
                    setExpanded(isExpanded ? null : alliance.id);
                  }}
                >
                  <div
                    className="alliance-dot"
                    style={{ background: alliance.color }}
                  />
                  <span className="alliance-name">{alliance.name}</span>
                  <span style={{
                    fontFamily: 'IBM Plex Mono,monospace', fontSize: 9,
                    padding: '2px 6px', borderRadius: 3, marginRight: 4,
                    background: `rgba(${acr},0.1)`, color: alliance.color,
                    border: `1px solid rgba(${acr},0.2)`, letterSpacing: '0.06em',
                  }}>{alliance.type}</span>
                  <span className="alliance-count">{alliance.members.length}</span>
                </button>

                {/* Member tags when expanded */}
                {(isActive || isExpanded) && (
                  <div className="member-tags" style={{ '--ac': alliance.color, '--acr': acr }}>
                    {alliance.members.map(m => (
                      <span key={m} className={`member-tag ${isActive ? 'highlight' : ''}`}>{m}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'IBM Plex Mono,monospace', fontSize: 10,
          color: '#8892a4', letterSpacing: '0.08em',
          background: 'rgba(0,0,0,0.2)',
        }}>
          Click alliance to highlight · Click again to clear
        </div>
      </div>
    </>
  );
}