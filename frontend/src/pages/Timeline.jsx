import { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { TIMELINE_CONFLICTS, TIMELINE_STATS } from '../data/timeline-data.js';
import Footer from '../components/Footer.jsx';
import SEO from '../seo/SEO.jsx';
import IntensityChart from '../components/IntensityChart.jsx';


// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Target: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Crosshair: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

:root {
  --tl-bg:      #050508;
  --tl-panel:   rgba(10, 12, 20, 0.75);
  --tl-border:  rgba(30, 36, 51, 0.8);
  --tl-accent:  #00d4ff;
  --tl-danger:  #ff3b3b;
  --tl-warn:    #ffaa00;
  --tl-green:   #00ff88;
  --tl-text:    #e8eaf0;
  --tl-muted:   #8892a4;
  --tl-dim:     #4a5568;
}

.tl-page {
  min-height: 100dvh;
  background: var(--tl-bg);
  color: var(--tl-text);
  font-family: 'Barlow', sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Tactical Grid Background */
.tl-page::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  z-index: 0;
  pointer-events: none;
}

.tl-content-layer {
  position: relative;
  z-index: 1;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.tl-hero {
  position: relative;
  padding: 64px 24px;
  overflow: hidden;
  border-bottom: 1px solid rgba(0,212,255,0.15);
  background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.tl-hero-inner { 
  position: relative; 
  z-index: 2; 
  max-width: 1400px; 
  margin: 0 auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.tl-hero-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.3);
  border-radius: 4px; padding: 8px 16px; margin-bottom: 24px;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--tl-accent); text-transform: uppercase;
  box-shadow: 0 0 15px rgba(0,212,255,0.15);
}
.tl-hero-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
  font-size: clamp(48px, 8vw, 88px); letter-spacing: -0.01em;
  line-height: 1; color: var(--tl-text); margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.tl-hero-title em { color: var(--tl-accent); font-style: normal; text-shadow: 0 0 24px rgba(0,212,255,0.4); }
.tl-hero-sub {
  font-size: 18px; color: var(--tl-muted); max-width: 700px;
  line-height: 1.6; margin-bottom: 40px;
}
.tl-global-stats {
  display: flex; gap: 0; width: 100%;
  border: 1px solid rgba(0,212,255,0.25); border-radius: 8px;
  overflow: hidden; max-width: 800px;
  background: rgba(10,12,20,0.85); backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.tl-gstat {
  flex: 1; padding: 20px 16px; text-align: center;
  border-right: 1px solid rgba(0,212,255,0.2);
}
.tl-gstat:last-child { border-right: none; }
.tl-gstat-val {
  display: block; font-family: 'IBM Plex Mono', monospace;
  font-size: 28px; font-weight: 600; color: var(--tl-accent);
  text-shadow: 0 0 12px rgba(0,212,255,0.4); margin-bottom: 6px;
}
.tl-gstat-val.danger { color: var(--tl-danger); text-shadow: 0 0 12px rgba(255,59,59,0.4); }
.tl-gstat-val.warn   { color: var(--tl-warn); text-shadow: 0 0 12px rgba(255,170,0,0.4); }
.tl-gstat-label {
  display: block; font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.15em; color: var(--tl-muted);
  text-transform: uppercase;
}

/* ── Layout ───────────────────────────────────────────────────────────────── */
.tl-layout {
  display: flex; gap: 32px;
  max-width: 1400px; margin: 0 auto;
  padding: 40px 48px 80px;
}

/* ── Left sidebar filters ─────────────────────────────────────────────────── */
.tl-sidebar {
  width: 280px; flex-shrink: 0;
  position: sticky; top: 80px; height: fit-content;
  max-height: calc(100vh - 100px); overflow-y: auto;
}
.tl-sidebar::-webkit-scrollbar { width: 4px; }
.tl-sidebar::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.2); border-radius: 2px; }

.tl-sidebar-section {
  margin-bottom: 24px;
  border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 6px;
  background: var(--tl-panel); backdrop-filter: blur(12px); overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.tl-sidebar-head {
  padding: 12px 16px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--tl-accent); text-transform: uppercase;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(0,212,255,0.05);
}
.tl-filter-btn {
  width: 100%; text-align: left; padding: 12px 16px;
  background: none; border: none; border-bottom: 1px solid var(--tl-border);
  cursor: pointer; font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 500;
  color: var(--tl-muted); transition: all 200ms ease; display: flex;
  justify-content: space-between; align-items: center;
}
.tl-filter-btn:last-child { border-bottom: none; }
.tl-filter-btn:hover { background: rgba(0,212,255,0.05); color: var(--tl-text); }
.tl-filter-btn.active {
  background: rgba(0,212,255,0.1); color: var(--tl-accent);
  border-left: 3px solid var(--tl-accent); padding-left: 13px;
}
.tl-filter-count {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  color: var(--tl-dim); background: rgba(255,255,255,0.05);
  padding: 2px 8px; border-radius: 4px;
}
.tl-filter-btn.active .tl-filter-count { color: var(--tl-accent); background: rgba(0,212,255,0.15); }

.tl-search-wrap { position: relative; margin-bottom: 24px; }
.tl-search {
  width: 100%; background: var(--tl-panel); border: 1px solid rgba(0,212,255,0.3);
  border-radius: 6px; padding: 14px 16px 14px 44px;
  color: var(--tl-text); font-family: 'IBM Plex Mono', monospace; font-size: 13px;
  outline: none; transition: all 200ms ease; backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.tl-search:focus { border-color: var(--tl-accent); box-shadow: 0 0 15px rgba(0,212,255,0.2); }
.tl-search::placeholder { color: var(--tl-dim); letter-spacing: 0.05em; }
.tl-search-icon {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  color: var(--tl-accent); pointer-events: none; opacity: 0.8;
}
.tl-year-range { padding: 16px; }
.tl-year-inputs { display: flex; gap: 12px; align-items: center; }
.tl-year-input {
  flex: 1; background: rgba(0,0,0,0.4); border: 1px solid var(--tl-border);
  border-radius: 4px; padding: 10px; color: var(--tl-text);
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none;
  text-align: center; transition: border-color 200ms ease;
}
.tl-year-input:focus { border-color: var(--tl-accent); background: rgba(0,212,255,0.05); }
.tl-year-sep { color: var(--tl-dim); font-size: 14px; flex-shrink: 0; }

/* ── Main content ─────────────────────────────────────────────────────────── */
.tl-main { flex: 1; min-width: 0; }

/* ── View tabs ────────────────────────────────────────────────────────────── */
.tl-view-tabs {
  display: flex; gap: 6px; margin-bottom: 24px;
  background: var(--tl-panel); border: 1px solid var(--tl-border);
  border-radius: 6px; padding: 6px; width: fit-content;
  backdrop-filter: blur(12px);
}
.tl-view-tab {
  padding: 10px 24px; border-radius: 4px; cursor: pointer;
  background: none; border: none; font-weight: 600;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px;
  letter-spacing: 0.1em; color: var(--tl-muted); text-transform: uppercase;
  transition: all 200ms ease;
}
.tl-view-tab:hover { color: var(--tl-text); background: rgba(255,255,255,0.05); }
.tl-view-tab.active {
  background: rgba(0,212,255,0.1); color: var(--tl-accent);
  border: 1px solid rgba(0,212,255,0.3); box-shadow: 0 0 10px rgba(0,212,255,0.15);
}

/* ── Sort / result bar ────────────────────────────────────────────────────── */
.tl-result-bar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
  padding: 16px 20px; background: rgba(0, 212, 255, 0.03);
  border: 1px solid rgba(0, 212, 255, 0.15); border-radius: 6px;
}
.tl-result-count {
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--tl-muted);
}
.tl-result-count span { color: var(--tl-accent); font-weight: 600; }
.tl-sort-group { display: flex; gap: 8px; flex-wrap: wrap; }
.tl-sort-btn {
  background: rgba(10,12,20,0.8); border: 1px solid var(--tl-border);
  border-radius: 4px; padding: 8px 16px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; color: var(--tl-muted); text-transform: uppercase;
  transition: all 200ms ease;
}
.tl-sort-btn:hover { color: var(--tl-text); border-color: rgba(0,212,255,0.3); }
.tl-sort-btn.active { color: var(--tl-bg); border-color: var(--tl-accent); background: var(--tl-accent); box-shadow: 0 0 12px rgba(0,212,255,0.4); }

/* ── Conflict card (list view) ────────────────────────────────────────────── */
.tl-card {
  border: 1px solid var(--tl-border); border-radius: 8px;
  background: var(--tl-panel); margin-bottom: 16px;
  overflow: hidden; cursor: pointer; transition: all 300ms ease;
  backdrop-filter: blur(12px);
}
.tl-card:hover { border-color: rgba(0,212,255,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.5); transform: translateY(-2px); }
.tl-card.expanded { border-color: var(--tl-accent); box-shadow: 0 8px 32px rgba(0,212,255,0.15), inset 0 0 20px rgba(0,212,255,0.05); }
.tl-card.war { border-left: 4px solid var(--tl-danger); }
.tl-card.active-conflict { border-left: 4px solid var(--tl-green); }

.tl-card-head {
  display: flex; gap: 20px; align-items: flex-start; padding: 20px 24px;
}
.tl-card-left { flex: 1; min-width: 0; }
.tl-card-location {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
  font-size: 26px; color: var(--tl-text); margin-bottom: 4px; letter-spacing: 0.01em;
}
.tl-card-sides {
  font-size: 16px; color: var(--tl-muted); margin-bottom: 12px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.tl-card-sides strong { color: rgba(232,234,240,0.9); font-weight: 600; }
.tl-card-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }

.tl-card-right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 12px; flex-shrink: 0;
}
.tl-year-span {
  font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600;
  color: var(--tl-muted); white-space: nowrap;
}
.tl-year-span span { color: var(--tl-text); }
.tl-expand-arrow {
  color: var(--tl-accent); transition: transform 200ms ease; opacity: 0.8;
}
.tl-expand-arrow.open { transform: rotate(180deg); opacity: 1; }

/* ── Badges ───────────────────────────────────────────────────────────────── */
.tl-badge {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  padding: 4px 10px; border-radius: 4px; letter-spacing: 0.1em;
  text-transform: uppercase; border: 1px solid; white-space: nowrap;
}
.tl-badge.active  { color: var(--tl-green);  border-color: rgba(0,255,136,0.4);  background: rgba(0,255,136,0.1); }
.tl-badge.war     { color: var(--tl-danger); border-color: rgba(255,59,59,0.4);  background: rgba(255,59,59,0.1); }
.tl-badge.minor   { color: var(--tl-warn);   border-color: rgba(255,170,0,0.4);  background: rgba(255,170,0,0.1); }
.tl-badge.type    { color: var(--tl-muted);  border-color: rgba(136,146,164,0.3); background: rgba(136,146,164,0.1); }
.tl-badge.region  { color: #00d4ff;          border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.1); }
.tl-badge.incompat { color: #c084fc;         border-color: rgba(192,132,252,0.3); background: rgba(192,132,252,0.1); }

/* ── Mini sparkline bar ───────────────────────────────────────────────────── */
.tl-spark {
  display: flex; gap: 3px; align-items: flex-end; height: 32px;
  padding: 0 24px 0;
}
.tl-spark-bar {
  width: 6px; border-radius: 2px 2px 0 0; flex-shrink: 0;
  transition: opacity 140ms;
}

/* ── Expanded episode timeline ────────────────────────────────────────────── */
.tl-episodes {
  border-top: 1px solid var(--tl-border);
  padding: 0 24px 24px;
  background: rgba(0,0,0,0.3);
  animation: tl-expand 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes tl-expand {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tl-ep-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0 16px;
}
.tl-ep-title {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--tl-accent); text-transform: uppercase;
  display: flex; align-items: center; gap: 8px;
}
.tl-ep-track {
  position: relative; padding-left: 24px; margin-top: 12px;
}
.tl-ep-line {
  position: absolute; left: 7px; top: 0; bottom: 0;
  width: 2px; background: var(--tl-border);
}
.tl-ep-row {
  position: relative; padding: 12px 0 12px 24px;
  border-bottom: 1px dashed rgba(22,27,46,0.8);
}
.tl-ep-row:last-child { border-bottom: none; }
.tl-ep-dot {
  position: absolute; left: -21px; top: 16px;
  width: 12px; height: 12px; border-radius: 50%; border: 2px solid;
  box-shadow: 0 0 10px currentColor;
}
.tl-ep-year {
  font-family: 'IBM Plex Mono', monospace; font-size: 15px;
  font-weight: 700; color: var(--tl-text); display: inline-block; margin-right: 12px;
}
.tl-ep-intensity {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
}
.tl-ep-dates {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px;
  color: var(--tl-muted); margin-top: 6px;
}
.tl-ep-end-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  color: #00d4ff; border: 1px solid rgba(0,212,255,0.3);
  background: rgba(0,212,255,0.1); padding: 4px 10px; border-radius: 4px;
  margin-left: 12px; letter-spacing: 0.1em; text-transform: uppercase;
}

/* ── Decade bar chart ─────────────────────────────────────────────────────── */
.tl-chart-wrap {
  background: var(--tl-panel); border: 1px solid rgba(0,212,255,0.2);
  border-radius: 8px; padding: 24px 32px; margin-bottom: 24px;
  backdrop-filter: blur(12px); box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.tl-chart-title {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--tl-accent); text-transform: uppercase;
  margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
}
.tl-chart-bars {
  display: flex; align-items: flex-end; gap: 8px; height: 100px;
}
.tl-chart-col { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
.tl-chart-bar {
  width: 100%; border-radius: 3px 3px 0 0;
  background: rgba(0,212,255,0.2); border: 1px solid rgba(0,212,255,0.3);
  transition: all 200ms ease; cursor: pointer; min-height: 4px;
}
.tl-chart-bar:hover { background: rgba(0,212,255,0.5); box-shadow: 0 0 15px rgba(0,212,255,0.3); }
.tl-chart-bar.selected { background: rgba(0,212,255,0.8); border-color: #fff; box-shadow: 0 0 20px rgba(0,212,255,0.5); }
.tl-chart-decade-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  color: var(--tl-muted); letter-spacing: 0.1em;
}

/* ── Visual timeline (horizontal scrollable) ──────────────────────────────── */
.tl-visual-outer {
  overflow-x: auto; padding-bottom: 12px;
  scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.3) transparent;
}
.tl-visual-wrap {
  position: relative; min-width: 1000px;
}
.tl-visual-axis {
  display: flex; border-bottom: 1px solid rgba(0,212,255,0.2);
  margin-bottom: 20px; padding-bottom: 8px;
}
.tl-visual-tick {
  flex: 1; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  color: var(--tl-muted); letter-spacing: 0.1em; text-align: center;
}
.tl-visual-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 6px;
  min-height: 32px; cursor: pointer;
}
.tl-visual-row:hover .tl-visual-label { color: var(--tl-accent); }
.tl-visual-label {
  width: 180px; flex-shrink: 0; font-size: 13px; font-weight: 500;
  color: var(--tl-text); text-align: right; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; padding-right: 8px;
  transition: color 200ms ease;
}
.tl-visual-track { flex: 1; position: relative; height: 24px; background: rgba(255,255,255,0.02); border-radius: 4px; }
.tl-visual-bar {
  position: absolute; height: 100%; border-radius: 4px;
  cursor: pointer; transition: opacity 200ms ease; min-width: 4px;
}
.tl-visual-bar:hover { opacity: 0.9; box-shadow: 0 0 12px currentColor; }
.tl-visual-bar-label {
  position: absolute; left: 8px; top: 4px; font-size: 10px; font-weight: 600;
  color: rgba(255,255,255,0.9); white-space: nowrap;
  font-family: 'IBM Plex Mono', monospace; pointer-events: none;
}

/* ── Empty state ──────────────────────────────────────────────────────────── */
.tl-empty {
  text-align: center; padding: 100px 24px;
  background: rgba(0,212,255,0.02);
  border: 1px dashed rgba(0,212,255,0.3); border-radius: 8px;
  font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600;
  color: var(--tl-muted); letter-spacing: 0.15em; text-transform: uppercase;
}

/* ── Pagination ───────────────────────────────────────────────────────────── */
.tl-pagination {
  display: flex; gap: 8px; justify-content: center; margin-top: 40px; flex-wrap: wrap;
}
.tl-page-btn {
  background: var(--tl-panel); border: 1px solid var(--tl-border);
  border-radius: 4px; padding: 10px 18px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  color: var(--tl-muted); transition: all 200ms ease;
}
.tl-page-btn:hover { color: var(--tl-accent); border-color: rgba(0,212,255,0.4); background: rgba(0,212,255,0.05); }
.tl-page-btn.active { color: var(--tl-bg); border-color: var(--tl-accent); background: var(--tl-accent); box-shadow: 0 0 15px rgba(0,212,255,0.4); }
.tl-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── Animations ───────────────────────────────────────────────────────────── */
@keyframes tl-fade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.tl-animate { animation: tl-fade 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes tl-pulse { 0%,100%{opacity:1; box-shadow: 0 0 12px currentColor;} 50%{opacity:0.5; box-shadow: 0 0 2px currentColor;} }
.tl-pulse { animation: tl-pulse 2s infinite; }

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .tl-hero   { padding: 48px 24px; }
  .tl-layout { padding: 32px 24px 80px; }
  .tl-sidebar { width: 240px; }
}
@media (max-width: 768px) {
  .tl-layout { flex-direction: column; padding: 24px 16px 80px; gap: 24px; }
  .tl-sidebar { width: 100%; position: static; padding: 0; }
  .tl-main    { padding: 0; }
  .tl-hero    { padding: 40px 16px; }
  .tl-global-stats { flex-wrap: wrap; }
  .tl-gstat   { min-width: calc(50% - 1px); }
  .tl-view-tabs { width: 100%; }
  .tl-view-tab  { flex: 1; text-align: center; }
  .tl-card-head { flex-direction: column; gap: 16px; }
  .tl-card-right { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; }
  .tl-sidebar-section { display: none; }
  .tl-sidebar-section.mobile-visible { display: block; }
  .tl-mobile-filter-toggle { display: flex !important; }
}
.tl-mobile-filter-toggle { display: none; }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE  = 25;
const REGIONS    = ['Europe','Middle East','Asia','Africa','Americas','Oceania'];
const CONF_TYPES = ['Extra-systemic','Inter-state','Internal','Internationalised internal'];
const SORT_OPTS  = [
  { id: 'start-desc', label: 'Newest' },
  { id: 'start-asc',  label: 'Oldest' },
  { id: 'duration',   label: 'Longest' },
  { id: 'intensity',  label: 'Intensity' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function intensityColor(level) {
  return level === 2 ? 'var(--tl-danger)' : 'var(--tl-warn)';
}
function intensityBg(level) {
  return level === 2 ? 'rgba(255,59,59,0.2)' : 'rgba(255,170,0,0.2)';
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ episodes }) {
  if (!episodes?.length) return null;
  return (
    <div className="tl-spark">
      {episodes.map((ep, i) => (
        <div
          key={i}
          className="tl-spark-bar"
          title={`${ep.year}: ${ep.intensityLabel}`}
          style={{
            height: ep.intensity === 2 ? 24 : 12,
            background: ep.intensity === 2 ? 'rgba(255,59,59,0.8)' : 'rgba(255,170,0,0.6)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Episode detail timeline ──────────────────────────────────────────────────
function EpisodeTimeline({ conflict }) {
  const { episodes, sideA, sideB, startDate, territory, incompatibility } = conflict;

  return (
    <div className="tl-episodes">
      <div className="tl-ep-header">
        <span className="tl-ep-title"><Icons.Target /> Conflict Episodes · {episodes.length} years on record</span>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {territory && (
            <span className="tl-badge incompat">
              {territory}
            </span>
          )}
          <span className="tl-badge incompat">{incompatibility}</span>
        </div>
      </div>

      {/* Key facts row */}
      <div style={{
        display:'flex', gap:24, flexWrap:'wrap', marginBottom:20,
        padding:'16px 0', borderBottom:'1px solid rgba(22,27,46,0.8)'
      }}>
        {[
          { label:'Side A', val: sideA },
          { label:'Side B', val: sideB },
          { label:'Start Date',  val: startDate ?? `${conflict.startYear}` },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:11, letterSpacing:'0.15em', color:'var(--tl-muted)', textTransform:'uppercase', marginBottom:6 }}>{f.label}</div>
            <div style={{ fontSize:15, color:'var(--tl-text)', fontWeight:500 }}>{f.val}</div>
          </div>
        ))}
      </div>

      {/* Episode track */}
      <div className="tl-ep-track">
        <div className="tl-ep-line" />
        {episodes.map((ep, i) => {
          const col = intensityColor(ep.intensity);
          const bg  = intensityBg(ep.intensity);
          return (
            <div key={i} className="tl-ep-row">
              <div className="tl-ep-dot" style={{ background: bg, borderColor: col, color: col }} />
              <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                <span className="tl-ep-year">{ep.year}</span>
                <span className="tl-ep-intensity" style={{ color: col }}>{ep.intensityLabel}</span>
                {ep.episodeEnd && (
                  <span className="tl-ep-end-badge">✓ CEASEFIRE / END</span>
                )}
                {ep.cumulative === 1 && (
                  <span style={{
                    fontFamily:'IBM Plex Mono,monospace', fontSize:10, fontWeight: 600,
                    color:'var(--tl-danger)', letterSpacing:'0.1em',
                    border:'1px solid rgba(255,59,59,0.3)', textTransform: 'uppercase',
                    background:'rgba(255,59,59,0.1)', padding:'3px 8px', borderRadius:4
                  }}>25+ Battle Deaths</span>
                )}
              </div>
              {(ep.startDate || ep.endDate) && (
                <div className="tl-ep-dates">
                  {ep.startDate && <span>FROM: {ep.startDate.toUpperCase()}</span>}
                  {ep.startDate && ep.endDate && <span style={{margin:'0 10px',color:'var(--tl-dim)'}}>|</span>}
                  {ep.endDate && <span>TO: {ep.endDate.toUpperCase()}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <IntensityChart conflictName={conflict.location} />
    </div>
  );
}

// ─── Conflict card ────────────────────────────────────────────────────────────
function ConflictCard({ conflict, expanded, onToggle }) {
  const isWar    = conflict.peakIntensity === 2;
  const isActive = conflict.isActive;

  return (
    <div
      className={`tl-card tl-animate ${expanded ? 'expanded' : ''} ${isWar && !isActive ? 'war' : ''} ${isActive ? 'active-conflict' : ''}`}
      onClick={onToggle}
    >
      <div className="tl-card-head">
        <div className="tl-card-left">
          <div className="tl-card-location">{conflict.location.toUpperCase()}</div>
          <div className="tl-card-sides">
            <strong>{conflict.sideA}</strong>
            <span style={{ color:'var(--tl-dim)', margin:'0 10px' }}>VS</span>
            <strong>{conflict.sideB}</strong>
          </div>
          <div className="tl-card-meta">
            {isActive
              ? <span className="tl-badge active"><span className="tl-pulse" style={{ display: 'inline-block', width: 6, height: 6, background: 'currentColor', borderRadius: '50%', marginRight: 6 }} /> ACTIVE</span>
              : <span className="tl-badge type">ENDED {conflict.lastYear}</span>
            }
            <span className={`tl-badge ${isWar ? 'war' : 'minor'}`}>{conflict.peakLabel}</span>
            <span className="tl-badge region">{conflict.region}</span>
            <span className="tl-badge type">{conflict.conflictType}</span>
          </div>
        </div>
        <div className="tl-card-right">
          <div className="tl-year-span">
            <span>{conflict.startYear}</span>
            {conflict.lastYear !== conflict.startYear && (
              <> <span style={{color:'var(--tl-dim)'}}>—</span> <span>{conflict.isActive ? 'PRESENT' : conflict.lastYear}</span></>
            )}
          </div>
          <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:12, color:'var(--tl-muted)' }}>
            {conflict.duration}Y · {conflict.episodeCount} EPISODES
          </div>
          <div className={`tl-expand-arrow ${expanded ? 'open' : ''}`}>
            <Icons.ChevronDown />
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <Sparkline episodes={conflict.episodes} />

      {/* Expanded detail */}
      {expanded && <EpisodeTimeline conflict={conflict} />}
    </div>
  );
}

// ─── Decade chart ─────────────────────────────────────────────────────────────
function DecadeChart({ stats, onDecadeClick, activDecade }) {
  const entries = Object.entries(stats.byDecade);
  const maxVal  = Math.max(...entries.map(([,v]) => v));

  return (
    <div className="tl-chart-wrap">
      <div className="tl-chart-title"><Icons.Crosshair /> Conflicts by Decade</div>
      <div className="tl-chart-bars">
        {entries.map(([decade, count]) => (
          <div key={decade} className="tl-chart-col">
            <div
              className={`tl-chart-bar ${activDecade === decade ? 'selected' : ''}`}
              style={{ height: `${(count / maxVal) * 100}%` }}
              title={`${decade}s: ${count} conflicts`}
              onClick={(e) => { e.stopPropagation(); onDecadeClick(decade); }}
            />
            <div className="tl-chart-decade-label">{decade.slice(2)}s</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visual (Gantt-style) timeline ────────────────────────────────────────────
function VisualTimeline({ conflicts, onSelect }) {
  const YEAR_MIN = TIMELINE_STATS.yearMin;
  const YEAR_MAX = TIMELINE_STATS.yearMax;
  const SPAN     = YEAR_MAX - YEAR_MIN + 1;
  const TICK_STEP = SPAN > 60 ? 10 : 5;

  const ticks = [];
  for (let y = Math.ceil(YEAR_MIN / TICK_STEP) * TICK_STEP; y <= YEAR_MAX; y += TICK_STEP) {
    ticks.push(y);
  }

  // Show top 60 longest conflicts for visual
  const shown = [...conflicts]
    .sort((a,b) => b.duration - a.duration)
    .slice(0, 60);

  return (
    <div className="tl-visual-outer">
      <div className="tl-visual-wrap" style={{ minWidth: Math.max(1000, SPAN * 14) }}>
        {/* Year axis */}
        <div className="tl-visual-axis">
          <div style={{ width:180, flexShrink:0 }} />
          {ticks.map(y => (
            <div
              key={y}
              className="tl-visual-tick"
              style={{ position:'absolute', left:`calc(180px + ${((y - YEAR_MIN) / SPAN) * 100}%)` }}
            >
              {y}
            </div>
          ))}
        </div>

        {/* Conflict rows */}
        {shown.map(c => {
          const left  = ((c.startYear - YEAR_MIN) / SPAN) * 100;
          const width = Math.max(0.5, ((c.lastYear - c.startYear + 1) / SPAN) * 100);
          const color = c.isActive
            ? 'rgba(0,255,136,0.8)'
            : c.peakIntensity === 2
              ? 'rgba(255,59,59,0.7)'
              : 'rgba(255,170,0,0.6)';

          return (
            <div key={c.id} className="tl-visual-row" onClick={() => onSelect(c)}>
              <div className="tl-visual-label" title={c.location}>{c.location.toUpperCase()}</div>
              <div className="tl-visual-track">
                <div
                  className="tl-visual-bar"
                  style={{ left:`${left}%`, width:`${width}%`, background:color, color: color }}
                  title={`${c.location} (${c.startYear}–${c.isActive ? 'present' : c.lastYear})`}
                />
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ display:'flex', gap:24, marginTop:24, flexWrap:'wrap', paddingLeft: 180 }}>
          {[
            { color:'rgba(0,255,136,0.8)',   label:'ACTIVE' },
            { color:'rgba(255,59,59,0.7)',  label:'WAR (ENDED)' },
            { color:'rgba(255,170,0,0.6)',  label:'MINOR (ENDED)' },
          ].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16, height:8, background:l.color, borderRadius:2, boxShadow: `0 0 8px ${l.color}` }} />
              <span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:11, fontWeight: 600, color:'var(--tl-muted)', letterSpacing: '0.1em' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Timeline() {
  injectCSS('timeline-css', CSS);

  const [view,         setView]         = useState('list');   // 'list' | 'visual'
  const [search,       setSearch]       = useState('');
  const [filterRegion, setFilterRegion] = useState(null);
  const [filterType,   setFilterType]   = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [filterDecade, setFilterDecade] = useState(null);
  const [filterWar,    setFilterWar]    = useState(false);
  const [yearMin,      setYearMin]      = useState('');
  const [yearMax,      setYearMax]      = useState('');
  const [sort,         setSort]         = useState('start-desc');
  const [page,         setPage]         = useState(1);
  const [expanded,     setExpanded]     = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mainRef = useRef(null);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let arr = TIMELINE_CONFLICTS;

    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(c =>
        c.location.toLowerCase().includes(q) ||
        c.sideA.toLowerCase().includes(q) ||
        c.sideB.toLowerCase().includes(q)
      );
    }
    if (filterRegion) arr = arr.filter(c => c.region === filterRegion);
    if (filterType)   arr = arr.filter(c => c.conflictType === filterType);
    if (filterActive) arr = arr.filter(c => c.isActive);
    if (filterWar)    arr = arr.filter(c => c.peakIntensity === 2);
    if (filterDecade) {
      const d = parseInt(filterDecade);
      arr = arr.filter(c => c.startYear >= d && c.startYear < d + 10);
    }
    if (yearMin) arr = arr.filter(c => c.startYear >= parseInt(yearMin));
    if (yearMax) arr = arr.filter(c => c.lastYear  <= parseInt(yearMax));

    // Sort
    arr = [...arr];
    if (sort === 'start-desc') arr.sort((a,b) => b.startYear - a.startYear);
    if (sort === 'start-asc')  arr.sort((a,b) => a.startYear - b.startYear);
    if (sort === 'duration')   arr.sort((a,b) => b.duration  - a.duration);
    if (sort === 'intensity')  arr.sort((a,b) => b.peakIntensity - a.peakIntensity || b.lastYear - a.lastYear);

    return arr;
  }, [search, filterRegion, filterType, filterActive, filterWar, filterDecade, yearMin, yearMax, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setSearch(''); setFilterRegion(null); setFilterType(null);
    setFilterActive(false); setFilterWar(false); setFilterDecade(null);
    setYearMin(''); setYearMax('');
    setPage(1);
  };

  const hasFilters = search || filterRegion || filterType || filterActive || filterWar || filterDecade || yearMin || yearMax;

  const handleDecadeClick = (d) => {
    setFilterDecade(prev => prev === d ? null : d);
    setPage(1);
  };

  const handleVisualSelect = (c) => {
    setView('list');
    setSearch(c.location);
    setPage(1);
    setTimeout(() => {
      setExpanded(c.id);
      mainRef.current?.scrollIntoView({ behavior:'smooth' });
    }, 100);
  };

  // Region counts for sidebar
  const regionCounts = useMemo(() => {
    const m = {};
    TIMELINE_CONFLICTS.forEach(c => { m[c.region] = (m[c.region]||0)+1; });
    return m;
  }, []);

  const typeCounts = useMemo(() => {
    const m = {};
    TIMELINE_CONFLICTS.forEach(c => { m[c.conflictType] = (m[c.conflictType]||0)+1; });
    return m;
  }, []);

  return (
    <div className="tl-page">
      <SEO
        title="Military Conflict Timeline — Wars & Conflicts Since 1900"
        description="Interactive timeline of major military conflicts worldwide from 1900 to present. Filter by region, decade, conflict type and casualty count."
        canonical="/timeline"
      />
      <div className="tl-content-layer">
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="tl-hero">
          <div className="tl-hero-inner">
            <div className="tl-hero-badge">
              <span className="tl-pulse" style={{ width:8, height:8, borderRadius:'50%', background:'var(--tl-accent)', display:'inline-block', boxShadow: '0 0 10px var(--tl-accent)' }} />
              UCDP Conflict Dataset · LOG: CONTINUOUS
            </div>
            <h1 className="tl-hero-title">
              GLOBAL CONFLICT<br/><em>TIMELINE</em>
            </h1>
            <p className="tl-hero-sub">
              Every recorded armed conflict from the Uppsala Conflict Data Program — searchable, filterable, with full episode history from inception to ceasefire.
            </p>
            <div className="tl-global-stats">
              <div className="tl-gstat">
                <span className="tl-gstat-val">{TIMELINE_STATS.total}</span>
                <span className="tl-gstat-label">RECORDED</span>
              </div>
              <div className="tl-gstat">
                <span className="tl-gstat-val danger">{TIMELINE_STATS.active}</span>
                <span className="tl-gstat-label">ACTIVE</span>
              </div>
              <div className="tl-gstat">
                <span className="tl-gstat-val warn">{TIMELINE_STATS.wars}</span>
                <span className="tl-gstat-label">WARS</span>
              </div>
              <div className="tl-gstat">
                <span className="tl-gstat-val">{TIMELINE_STATS.yearMin}</span>
                <span className="tl-gstat-label">EARLIEST</span>
              </div>
              <div className="tl-gstat">
                <span className="tl-gstat-val">{TIMELINE_STATS.yearMax}</span>
                <span className="tl-gstat-label">LATEST</span>
              </div>
            </div>
          </div>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-timeline-top" size="728x90" />
          </div>
        )}

        {/* ── Layout ────────────────────────────────────────────────────────── */}
        <div className="tl-layout">

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="tl-sidebar">

            {/* Mobile filter toggle */}
            <button
              className="tl-mobile-filter-toggle"
              onClick={() => setMobileFiltersOpen(o => !o)}
              style={{
                width:'100%', marginBottom:16, background:'rgba(10,12,20,0.8)',
                border:'1px solid var(--tl-border)', borderRadius:6, padding:'14px 16px',
                color:'var(--tl-text)', fontFamily:'IBM Plex Mono,monospace', fontSize:13,
                fontWeight: 600, letterSpacing:'0.1em', cursor:'pointer', textAlign:'left',
                display:'flex', justifyContent:'space-between', alignItems: 'center'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Filter /> DATA FILTERS</span>
              <span>{mobileFiltersOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</span>
            </button>

            {/* Search */}
            <div className={`tl-sidebar-section ${mobileFiltersOpen ? 'mobile-visible' : ''}`} style={{ padding:'16px' }}>
              <div className="tl-search-wrap" style={{ marginBottom:0 }}>
                <span className="tl-search-icon"><Icons.Search /></span>
                <input
                  className="tl-search"
                  placeholder="> QUERY LOCATION..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            {/* Quick toggles */}
            <div className={`tl-sidebar-section ${mobileFiltersOpen ? 'mobile-visible' : ''}`}>
              <div className="tl-sidebar-head">THREAT LEVEL</div>
              {[
                { label:'Active Conflicts', active: filterActive, toggle: () => { setFilterActive(p=>!p); setPage(1); }, count: TIMELINE_STATS.active },
                { label:'Wars Only',        active: filterWar,    toggle: () => { setFilterWar(p=>!p);    setPage(1); }, count: TIMELINE_STATS.wars  },
              ].map(f => (
                <button key={f.label} className={`tl-filter-btn ${f.active ? 'active' : ''}`} onClick={f.toggle}>
                  {f.label} <span className="tl-filter-count">{f.count}</span>
                </button>
              ))}
            </div>

            {/* Year range */}
            <div className={`tl-sidebar-section ${mobileFiltersOpen ? 'mobile-visible' : ''}`}>
              <div className="tl-sidebar-head">TEMPORAL RANGE</div>
              <div className="tl-year-range">
                <div className="tl-year-inputs">
                  <input
                    className="tl-year-input" type="number"
                    placeholder={String(TIMELINE_STATS.yearMin)}
                    value={yearMin}
                    onChange={e => { setYearMin(e.target.value); setPage(1); }}
                  />
                  <span className="tl-year-sep">—</span>
                  <input
                    className="tl-year-input" type="number"
                    placeholder={String(TIMELINE_STATS.yearMax)}
                    value={yearMax}
                    onChange={e => { setYearMax(e.target.value); setPage(1); }}
                  />
                </div>
              </div>
            </div>

            {/* Region */}
            <div className={`tl-sidebar-section ${mobileFiltersOpen ? 'mobile-visible' : ''}`}>
              <div className="tl-sidebar-head">GEOGRAPHIC SECTOR</div>
              {REGIONS.map(r => (
                <button
                  key={r}
                  className={`tl-filter-btn ${filterRegion === r ? 'active' : ''}`}
                  onClick={() => { setFilterRegion(p => p === r ? null : r); setPage(1); }}
                >
                  {r} <span className="tl-filter-count">{regionCounts[r] ?? 0}</span>
                </button>
              ))}
            </div>

            {/* Conflict type */}
            <div className={`tl-sidebar-section ${mobileFiltersOpen ? 'mobile-visible' : ''}`}>
              <div className="tl-sidebar-head">CONFLICT CLASSIFICATION</div>
              {CONF_TYPES.map(t => (
                <button
                  key={t}
                  className={`tl-filter-btn ${filterType === t ? 'active' : ''}`}
                  onClick={() => { setFilterType(p => p === t ? null : t); setPage(1); }}
                >
                  <span style={{ fontSize:13 }}>{t}</span>
                  <span className="tl-filter-count">{typeCounts[t] ?? 0}</span>
                </button>
              ))}
            </div>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={resetFilters}
                style={{
                  width:'100%', padding:'12px 16px', background:'rgba(255,59,59,0.1)',
                  border:'1px solid rgba(255,59,59,0.3)', borderRadius:6, cursor:'pointer',
                  fontFamily:'IBM Plex Mono,monospace', fontSize:12, fontWeight: 600,
                  letterSpacing:'0.1em', color:'#ff8080', textTransform:'uppercase',
                  marginTop:8, transition: 'all 200ms ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,59,0.2)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,59,59,0.1)'; e.currentTarget.style.color = '#ff8080'; }}
              >
                ✕ RESET FILTERS
              </button>
            )}
          </aside>

          {/* ── Main ──────────────────────────────────────────────────────── */}
          <main className="tl-main" ref={mainRef}>

            {/* Decade chart */}
            <DecadeChart
              stats={TIMELINE_STATS}
              onDecadeClick={handleDecadeClick}
              activDecade={filterDecade}
            />

            {/* View tabs + sort */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, marginBottom:24 }}>
              <div className="tl-view-tabs">
                {[
                  { id:'list',   label:'📋 LIST MATRIX' },
                  { id:'visual', label:'📊 GANTT VISUAL' },
                ].map(v => (
                  <button key={v.id} className={`tl-view-tab ${view === v.id ? 'active' : ''}`} onClick={() => setView(v.id)}>
                    {v.label}
                  </button>
                ))}
              </div>

              <div className="tl-sort-group">
                {SORT_OPTS.map(s => (
                  <button
                    key={s.id}
                    className={`tl-sort-btn ${sort === s.id ? 'active' : ''}`}
                    onClick={() => { setSort(s.id); setPage(1); }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <div className="tl-result-bar">
              <div className="tl-result-count">
                DISPLAYING <span>{filtered.length.toLocaleString()}</span> OF <span>{TIMELINE_STATS.total}</span> RECORDS
                {filterDecade && <span style={{color:'var(--tl-warn)', marginLeft:12}}>| {filterDecade}s</span>}
              </div>
            </div>

            {/* ── List view ─────────────────────────────────────────────── */}
            {view === 'list' && (
              <>
                {paginated.length === 0
                  ? <div className="tl-empty">[ ERR: NO RECORDS MATCH CURRENT PARAMETERS ]</div>
                  : paginated.map(c => (
                      <ConflictCard
                        key={c.id}
                        conflict={c}
                        expanded={expanded === c.id}
                        onToggle={() => setExpanded(p => p === c.id ? null : c.id)}
                      />
                    ))
                }

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="tl-pagination">
                    <button className="tl-page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>← PREV</button>
                    {Array.from({length: Math.min(totalPages, 7)}, (_,i) => {
                      let p;
                      if (totalPages <= 7) p = i + 1;
                      else if (page <= 4) p = i + 1;
                      else if (page >= totalPages - 3) p = totalPages - 6 + i;
                      else p = page - 3 + i;
                      return (
                        <button key={p} className={`tl-page-btn ${page===p?'active':''}`} onClick={() => setPage(p)}>{p}</button>
                      );
                    })}
                    <button className="tl-page-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>NEXT →</button>
                  </div>
                )}
              </>
            )}

            {/* ── Visual timeline ───────────────────────────────────────── */}
            {view === 'visual' && (
              <div className="tl-animate" style={{ background:'rgba(10,12,20,0.8)', border:'1px solid var(--tl-border)', borderRadius:8, padding:'32px 24px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:12, fontWeight: 600, letterSpacing:'0.15em', color:'var(--tl-accent)', textTransform:'uppercase', marginBottom:24 }}>
                  <Icons.Crosshair /> TACTICAL GANTT OVERVIEW — TOP {Math.min(filtered.length, 60)} LONGEST CONFLICTS (CLICK TO DRILL IN)
                </div>
                <VisualTimeline conflicts={filtered} onSelect={handleVisualSelect} />
              </div>
            )}

          </main>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '0 0 40px', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-timeline-bottom" size="728x90" />
          </div>
        )}
      </div>
        <Footer />
    </div>
  );
}