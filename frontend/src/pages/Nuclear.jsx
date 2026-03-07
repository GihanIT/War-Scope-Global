import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NUCLEAR_COUNTRIES, NUCLEAR_SUMMARY } from '../data/nuclear-data.js';
import Navbar from '../components/Navbar.jsx';
import AdBanner from '../components/AdBanner.jsx';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Nuclear: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .11 1.89l1.8 2.6a4.8 4.8 0 0 0 .8-1.5z"/><path d="M15 19.4a1.65 1.65 0 0 0 1.89.11l2.6 1.8a4.8 4.8 0 0 0-1.5.8z"/><path d="M12 21a1.65 1.65 0 0 0-1.65-1.65H8.5a4.8 4.8 0 0 0 0 3h1.85A1.65 1.65 0 0 0 12 21z"/><path d="M4.6 15a1.65 1.65 0 0 1-.11 1.89l-1.8 2.6a4.8 4.8 0 0 1-.8-1.5z"/><path d="M9 19.4a1.65 1.65 0 0 1-1.89.11l-2.6 1.8a4.8 4.8 0 0 1 1.5.8z"/><path d="M12 3a1.65 1.65 0 0 1 1.65 1.65h1.85a4.8 4.8 0 0 1 0-3h-1.85A1.65 1.65 0 0 1 12 3z"/><path d="M15 4.6a1.65 1.65 0 0 1-1.89-.11l-2.6-1.8a4.8 4.8 0 0 1 1.5-.8z"/><path d="M19.4 9a1.65 1.65 0 0 1-.11-1.89l1.8-2.6a4.8 4.8 0 0 1 .8 1.5z"/><path d="M4.6 9a1.65 1.65 0 0 0 .11-1.89l-1.8-2.6a4.8 4.8 0 0 0-.8 1.5z"/><path d="M9 4.6a1.65 1.65 0 0 0 1.89-.11l2.6-1.8a4.8 4.8 0 0 0-1.5-.8z"/></svg>,
  Missile: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>,
  Globe: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Warning: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>, // Fixed: Added missing icon
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap');

  .nuc-page-wrapper { 
    min-height: 100dvh; 
    background: #050508; 
    color: #e8eaf0; 
    font-family: 'Barlow', sans-serif; 
    position: relative;
  }

  /* Tactical Grid Background */
  .nuc-page-wrapper::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 59, 59, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 59, 59, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
    z-index: 0;
    pointer-events: none;
  }

  .nuc-content-layer {
    position: relative;
    z-index: 1;
  }

  .nuc-hero {
    position: relative; 
    padding: 80px 24px 64px;
    background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(255,59,59,0.12) 0%, transparent 70%);
    border-bottom: 1px solid rgba(255,59,59,0.2);
    text-align: center; 
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  
  .nuc-hero-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,59,59,0.1); border: 1px solid rgba(255,59,59,0.4);
    border-radius: 4px; padding: 8px 16px; margin-bottom: 24px;
    font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
    letter-spacing: 0.15em; color: #ff8080; text-transform: uppercase;
    box-shadow: 0 0 15px rgba(255,59,59,0.2);
  }
  
  .nuc-hero-title {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
    font-size: clamp(48px, 8vw, 88px); letter-spacing: -0.01em;
    color: #e8eaf0; line-height: 1; margin-bottom: 20px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.8);
  }
  .nuc-hero-title span { color: #ff3b3b; text-shadow: 0 0 24px rgba(255,59,59,0.5); }
  
  .nuc-hero-sub {
    font-size: 18px; color: #8892a4; max-width: 640px; margin: 0 auto 48px;
    line-height: 1.6;
  }

  .nuc-stats-bar {
    display: flex; justify-content: center; gap: 0;
    border: 1px solid rgba(255,59,59,0.3); border-radius: 8px;
    overflow: hidden; max-width: 800px; margin: 0 auto;
    background: rgba(10,12,20,0.85); backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }
  .nuc-stat {
    flex: 1; padding: 24px 20px; text-align: center;
    border-right: 1px solid rgba(255,59,59,0.2);
  }
  .nuc-stat:last-child { border-right: none; }
  .nuc-stat-val {
    font-family: 'IBM Plex Mono', monospace; font-size: 32px; font-weight: 600;
    color: #ff3b3b; display: block; margin-bottom: 8px;
    text-shadow: 0 0 12px rgba(255,59,59,0.4);
  }
  .nuc-stat-label {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    letter-spacing: 0.15em; color: #8892a4; text-transform: uppercase;
  }

  .nuc-layout { display: flex; max-width: 1400px; margin: 0 auto; padding: 0; min-height: calc(100vh - 300px); }

  .nuc-sidebar {
    width: 280px; flex-shrink: 0; border-right: 1px solid rgba(255,59,59,0.2);
    padding: 32px 0; position: sticky; top: 0; height: 100vh;
    overflow-y: auto; background: rgba(5,5,8,0.95); backdrop-filter: blur(12px);
  }
  .nuc-sidebar-title {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
    letter-spacing: 0.18em; color: #ff8080; text-transform: uppercase;
    padding: 0 24px 16px; border-bottom: 1px solid rgba(255,59,59,0.2); margin-bottom: 12px;
  }
  .nuc-country-btn {
    width: 100%; background: none; border: none; cursor: pointer;
    padding: 16px 24px; display: flex; align-items: center; gap: 16px;
    text-align: left; transition: all 200ms ease; border-left: 4px solid transparent;
  }
  .nuc-country-btn:hover { background: rgba(255,59,59,0.05); }
  .nuc-country-btn.active { background: rgba(255,59,59,0.1); border-left-color: #ff3b3b; box-shadow: inset 0 0 20px rgba(255,59,59,0.05); }
  .nuc-country-flag { font-size: 26px; flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  .nuc-country-info { flex: 1; min-width: 0; }
  .nuc-country-name { font-size: 16px; font-weight: 600; color: #e8eaf0; letter-spacing: 0.02em; }
  .nuc-country-count {
    font-family: 'IBM Plex Mono', monospace; font-size: 12px;
    color: #ff8080; margin-top: 4px;
  }
  .nuc-country-bar {
    height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 8px; overflow: hidden;
  }
  .nuc-country-bar-fill { height: 100%; background: #ff3b3b; border-radius: 2px; transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1); }

  .nuc-content { flex: 1; overflow-y: auto; padding: 48px; min-width: 0; }

  .nuc-country-header {
    display: flex; align-items: flex-start; gap: 32px;
    padding: 32px; background: rgba(255,59,59,0.05);
    border: 1px solid rgba(255,59,59,0.25); border-radius: 8px;
    margin-bottom: 32px; backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .nuc-ch-flag { font-size: 64px; flex-shrink: 0; line-height: 1; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
  .nuc-ch-main { flex: 1; }
  .nuc-ch-name {
    font-family: 'Barlow Condensed', sans-serif; font-size: 42px;
    font-weight: 800; color: #e8eaf0; margin-bottom: 8px; letter-spacing: 0.01em;
  }
  .nuc-ch-doctrine {
    font-size: 16px; color: #8892a4; line-height: 1.6; max-width: 700px;
    border-left: 3px solid rgba(255,59,59,0.5); padding-left: 16px; margin: 16px 0;
    background: linear-gradient(90deg, rgba(255,59,59,0.05) 0%, transparent 100%);
    padding-top: 4px; padding-bottom: 4px;
  }
  .nuc-ch-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
  .nuc-tag {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; padding: 6px 12px; border-radius: 4px;
    border: 1px solid rgba(0,212,255,0.3); color: #00d4ff;
    background: rgba(0,212,255,0.08); text-transform: uppercase;
  }
  .nuc-tag.red { border-color: rgba(255,59,59,0.4); color: #ff8080; background: rgba(255,59,59,0.1); }
  
  .nuc-ch-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    margin-top: 32px;
  }
  .nuc-mini-stat {
    background: rgba(5,5,8,0.6); border: 1px solid rgba(255,59,59,0.2);
    border-radius: 6px; padding: 16px 20px; text-align: center;
  }
  .nuc-mini-val {
    font-family: 'IBM Plex Mono', monospace; font-size: 26px;
    font-weight: 600; color: #ff3b3b; display: block;
  }
  .nuc-mini-label {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: #8892a4; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 6px;
  }

  .nuc-first-test {
    display: flex; align-items: center; gap: 24px;
    padding: 24px 28px; margin-bottom: 32px;
    background: rgba(255,170,0,0.05); border: 1px solid rgba(255,170,0,0.25);
    border-radius: 8px; backdrop-filter: blur(8px);
  }
  .nuc-ft-icon { color: #ffaa00; flex-shrink: 0; opacity: 0.8; }
  .nuc-ft-label {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
    letter-spacing: 0.15em; color: #ffaa00; text-transform: uppercase; margin-bottom: 8px;
  }
  .nuc-ft-detail { font-size: 17px; color: #e8eaf0; font-weight: 500; }
  .nuc-ft-meta { font-size: 14px; color: #8892a4; margin-top: 6px; font-family: 'IBM Plex Mono', monospace; }

  .nuc-section-title {
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600;
    letter-spacing: 0.18em; color: #ff8080; text-transform: uppercase;
    margin-bottom: 24px; padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,59,59,0.2);
    display: flex; align-items: center; gap: 12px;
  }

  .nuc-weapons-grid { display: flex; flex-direction: column; gap: 24px; margin-bottom: 48px; }

  .nuc-weapon-card {
    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
    overflow: hidden; background: rgba(10,12,20,0.75);
    transition: all 200ms ease; backdrop-filter: blur(8px);
  }
  .nuc-weapon-card:hover { border-color: rgba(255,59,59,0.4); box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
  .nuc-weapon-card.open { border-color: rgba(255,59,59,0.5); background: rgba(10,12,20,0.95); }

  .nuc-weapon-header {
    display: flex; align-items: stretch; gap: 0; cursor: pointer;
  }
  .nuc-weapon-img {
    width: 220px; object-fit: cover; flex-shrink: 0;
    border-right: 1px solid rgba(255,255,255,0.05);
  }
  .nuc-weapon-img-placeholder {
    width: 220px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(30,36,51,0.5) 0%, rgba(10,12,20,0.8) 100%);
    border-right: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,59,59,0.3);
  }
  .nuc-weapon-summary { flex: 1; padding: 20px 24px; display: flex; flexDirection: column; justify-content: center; }
  .nuc-weapon-name {
    font-family: 'Barlow Condensed', sans-serif; font-size: 26px;
    font-weight: 700; color: #e8eaf0; margin-bottom: 4px;
  }
  .nuc-weapon-nato { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #8892a4; margin-bottom: 12px; }
  .nuc-weapon-badges { display: flex; gap: 8px; flex-wrap: wrap; }
  .nuc-badge {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
    padding: 4px 10px; border-radius: 4px; letter-spacing: 0.1em;
    border: 1px solid rgba(0,212,255,0.3); color: #00d4ff; background: rgba(0,212,255,0.08);
  }
  .nuc-badge.red { border-color: rgba(255,59,59,0.4); color: #ff8080; background: rgba(255,59,59,0.1); }
  .nuc-badge.amber { border-color: rgba(255,170,0,0.4); color: #ffaa00; background: rgba(255,170,0,0.1); }
  .nuc-badge.green { border-color: rgba(0,200,80,0.4); color: #00e676; background: rgba(0,200,80,0.1); }
  
  .nuc-weapon-quick { 
    display: grid; grid-template-columns: repeat(3,1fr); gap: 0;
    border-left: 1px solid rgba(255,255,255,0.05); min-width: 280px;
    background: rgba(0,0,0,0.2);
  }
  .nuc-wq-item {
    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: center;
    display: flex; flex-direction: column; justify-content: center;
  }
  .nuc-wq-item:nth-child(n+4) { border-bottom: none; }
  .nuc-wq-val { font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 600; color: #ff3b3b; }
  .nuc-wq-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #8892a4; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  
  .nuc-expand-btn {
    background: rgba(0,0,0,0.3); border: none; border-left: 1px solid rgba(255,255,255,0.05); color: #8892a4; cursor: pointer;
    padding: 0 20px; transition: all 200ms ease; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .nuc-expand-btn:hover { color: #ff8080; background: rgba(255,59,59,0.05); }

  .nuc-weapon-detail { padding: 32px; border-top: 1px solid rgba(255,59,59,0.2); background: rgba(5,5,8,0.4); }
  .nuc-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
  
  .nuc-detail-label {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
    letter-spacing: 0.15em; color: #8892a4; text-transform: uppercase; margin-bottom: 12px;
  }
  .nuc-detail-val { font-size: 15px; color: #e8eaf0; line-height: 1.6; }
  
  .nuc-blast-zones { margin-bottom: 32px; }
  .nuc-blast-title {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
    letter-spacing: 0.15em; color: #ff8080; text-transform: uppercase; margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  
  .nuc-blast-row {
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
    background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.02);
  }
  .nuc-blast-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 10px currentColor; }
  .nuc-blast-zone-name { font-size: 14px; font-weight: 500; color: #e8eaf0; flex: 1; }
  .nuc-blast-km {
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #ff8080; font-weight: 600;
  }
  .nuc-blast-desc { font-size: 13px; color: #8892a4; width: 40%; text-align: right; }

  .nuc-launch-steps { margin-bottom: 32px; }
  .nuc-step {
    display: flex; gap: 16px; padding: 16px 0;
    border-bottom: 1px dashed rgba(255,255,255,0.1);
  }
  .nuc-step:last-child { border-bottom: none; }
  .nuc-step-num {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,59,59,0.1); border: 1px solid rgba(255,59,59,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: #ff8080;
  }
  .nuc-step-text { font-size: 15px; color: #cdd6f4; line-height: 1.6; padding-top: 4px; }

  .nuc-features { margin-bottom: 16px; }
  .nuc-feature {
    display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;
  }
  .nuc-feature-bullet { color: #ff3b3b; flex-shrink: 0; margin-top: 2px; }
  .nuc-feature-text { font-size: 15px; color: #cdd6f4; line-height: 1.6; }

  .nuc-desc {
    font-size: 16px; color: #8892a4; line-height: 1.8;
    padding: 20px 24px; background: rgba(0,0,0,0.3);
    border-radius: 6px; border-left: 4px solid rgba(255,59,59,0.5);
    margin-bottom: 32px;
  }

  .nuc-comparison { max-width: 1400px; margin: 0 auto; padding: 64px 48px; }
  .nuc-compare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 24px; }
  .nuc-compare-card {
    background: rgba(10,12,20,0.8); border: 1px solid rgba(255,59,59,0.2);
    border-radius: 8px; padding: 24px; cursor: pointer; transition: all 200ms ease;
    backdrop-filter: blur(8px);
  }
  .nuc-compare-card:hover { border-color: rgba(255,59,59,0.5); background: rgba(255,59,59,0.05); box-shadow: 0 8px 24px rgba(0,0,0,0.4); transform: translateY(-4px); }
  .nuc-cc-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .nuc-cc-flag { font-size: 36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  .nuc-cc-name { font-size: 18px; font-weight: 600; color: #e8eaf0; }
  .nuc-cc-total { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #ff8080; margin-top: 4px; }
  .nuc-cc-bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; margin-bottom: 16px; overflow: hidden; }
  .nuc-cc-fill { height: 100%; border-radius: 3px; background: #ff3b3b; }
  .nuc-cc-rows { display: flex; flex-direction: column; gap: 8px; }
  .nuc-cc-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .nuc-cc-row:last-child { border-bottom: none; padding-bottom: 0; }
  .nuc-cc-row-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #8892a4; letter-spacing: 0.1em; text-transform: uppercase;}
  .nuc-cc-row-val { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #e8eaf0; font-weight: 500;}

  .nuc-source {
    text-align: center; padding: 32px 24px; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; color: rgba(136,146,164,0.5); border-top: 1px solid rgba(255,255,255,0.05);
    letter-spacing: 0.1em; background: #050508;
  }

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .nuc-layout { flex-direction: column; }
    .nuc-sidebar { 
      width: 100%; height: auto; position: static; display: flex; overflow-x: auto; 
      padding: 16px 24px; gap: 12px; border-right: none; border-bottom: 1px solid rgba(255,59,59,0.2); 
    }
    .nuc-sidebar-title { display: none; }
    .nuc-country-btn { 
      width: auto; min-width: 140px; flex-direction: column; align-items: center; 
      text-align: center; padding: 12px 16px; border-left: none; border-bottom: 4px solid transparent; 
      background: rgba(0,0,0,0.2); border-radius: 6px 6px 0 0;
    }
    .nuc-country-btn.active { border-bottom-color: #ff3b3b; border-left-color: transparent; background: rgba(255,59,59,0.1); }
    .nuc-country-bar { display: none; }
    .nuc-content { padding: 32px 24px; }
  }

  @media (max-width: 768px) {
    .nuc-stats-bar { flex-direction: column; border-radius: 8px; }
    .nuc-stat { border-right: none; border-bottom: 1px solid rgba(255,59,59,0.2); padding: 16px; }
    
    .nuc-country-header { flex-direction: column; align-items: center; text-align: center; padding: 24px; gap: 20px; }
    .nuc-ch-doctrine { border-left: none; border-top: 2px solid rgba(255,59,59,0.5); padding-left: 0; padding-top: 16px; background: none; }
    .nuc-ch-tags { justify-content: center; }
    .nuc-ch-stats { grid-template-columns: 1fr 1fr; gap: 12px; }
    
    .nuc-first-test { flex-direction: column; text-align: center; gap: 16px; }

    .nuc-weapon-header { flex-direction: column; align-items: stretch; }
    .nuc-weapon-img, .nuc-weapon-img-placeholder { width: 100%; height: 180px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .nuc-weapon-quick { grid-template-columns: 1fr 1fr; border-left: none; border-top: 1px solid rgba(255,255,255,0.05); }
    .nuc-expand-btn { padding: 16px; border-left: none; border-top: 1px solid rgba(255,255,255,0.05); }
    
    .nuc-detail-grid { grid-template-columns: 1fr; gap: 24px; }
    .nuc-blast-row { flex-direction: column; align-items: flex-start; gap: 8px; }
    .nuc-blast-desc { width: 100%; text-align: left; }
    .nuc-compare-grid { grid-template-columns: 1fr; }
  }

  @keyframes nuc-fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .nuc-animate { animation: nuc-fade-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes pulse-red { 0%,100% { opacity:1; box-shadow: 0 0 15px rgba(255,59,59,0.4); } 50% { opacity:0.6; box-shadow: 0 0 5px rgba(255,59,59,0.1); } }
  .pulse-red { animation: pulse-red 2s infinite; border-radius: 50%; }
`;

// ─── Blast zone data ──────────────────────────────────────────────────────────
const BLAST_ZONES = [
  { key: 'fireball',       label: 'Fireball / Ground Zero',  color: '#ff0000', desc: 'Complete vaporization. Nothing survives.' },
  { key: 'heavy_blast',    label: 'Heavy Blast (20 psi)',    color: '#ff6600', desc: 'Reinforced concrete destroyed. 100% casualties.' },
  { key: 'moderate_blast', label: 'Moderate Blast (5 psi)',  color: '#ffaa00', desc: 'Most buildings collapse. 50% casualties.' },
  { key: 'thermal',        label: 'Thermal Radiation',       color: '#ffdd00', desc: 'Third-degree burns. Fires ignite.' },
  { key: 'radiation',      label: 'Lethal Radiation (500 rem)',color: '#00ff88', desc: '50% mortality within 30 days without treatment.' },
];

const MAX_WARHEADS = 5889; // Russia — for bar scaling

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ─── WeaponCard component ─────────────────────────────────────────────────────
function WeaponCard({ weapon }) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const typeBadge = weapon.type.includes('ICBM') ? 'red'
    : weapon.type.includes('SLBM') ? 'red'
    : weapon.type.includes('Tactical') ? 'amber'
    : 'default';

  return (
    <div className={`nuc-weapon-card ${open ? 'open' : ''}`}>
      {/* Header row */}
      <div className="nuc-weapon-header" onClick={() => setOpen(o => !o)}>
        {weapon.image && !imgError
          ? <img src={weapon.image} alt={weapon.name} className="nuc-weapon-img" onError={() => setImgError(true)} />
          : <div className="nuc-weapon-img-placeholder"><Icons.Missile /></div>
        }

        <div className="nuc-weapon-summary">
          <div className="nuc-weapon-name">{weapon.name}</div>
          {weapon.nato && <div className="nuc-weapon-nato">NATO REPORTING NAME: {weapon.nato}</div>}
          <div className="nuc-weapon-badges">
            <span className={`nuc-badge ${typeBadge}`}>{weapon.type}</span>
            <span className={`nuc-badge ${weapon.status === 'Active' ? 'green' : 'amber'}`}>{weapon.status}</span>
            <span className="nuc-badge">{weapon.yield.warheads}</span>
          </div>
        </div>

        <div className="nuc-weapon-quick">
          <div className="nuc-wq-item">
            <div className="nuc-wq-val">{weapon.yield.max}{weapon.yield.unit}</div>
            <div className="nuc-wq-label">Max Yield</div>
          </div>
          <div className="nuc-wq-item">
            <div className="nuc-wq-val">{weapon.range > 0 ? (weapon.range >= 1000 ? `${weapon.range/1000}k` : weapon.range) : 'N/A'}</div>
            <div className="nuc-wq-label">Range km</div>
          </div>
          <div className="nuc-wq-item">
            <div className="nuc-wq-val">{weapon.quantity}</div>
            <div className="nuc-wq-label">Active Units</div>
          </div>
          <div className="nuc-wq-item">
            <div className="nuc-wq-val">{weapon.firstDeployed}</div>
            <div className="nuc-wq-label">Deployed</div>
          </div>
          <div className="nuc-wq-item">
            <div className="nuc-wq-val">{weapon.blast_radius?.heavy_blast ?? '?'}km</div>
            <div className="nuc-wq-label">Blast Radius</div>
          </div>
          <div className="nuc-wq-item">
            <div className="nuc-wq-val">{weapon.cost?.split('$')[1]?.split(' ')[0] ?? '?'}</div>
            <div className="nuc-wq-label">Unit Cost</div>
          </div>
        </div>

        <button className="nuc-expand-btn">
          {open ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </button>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="nuc-weapon-detail nuc-animate">

          <p className="nuc-desc">{weapon.description}</p>

          <div className="nuc-detail-grid">
            <div>
              <div className="nuc-detail-label">Hardware Specifications</div>
              <div className="nuc-detail-val">
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px'}}>
                  {[
                    ['Length', weapon.length],
                    ['Diameter', weapon.diameter],
                    ['Weight', weapon.weight],
                    ['Speed', weapon.speed],
                    ['Propulsion', weapon.propulsion],
                    ['Cost', weapon.cost],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <span style={{color:'#8892a4',fontSize:12,fontFamily:'IBM Plex Mono, monospace',letterSpacing:'0.1em', textTransform: 'uppercase'}}>{k}: </span>
                      <strong style={{ display: 'block', marginTop: 4 }}>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="nuc-detail-label">Yield & Payload Delivery</div>
              <div className="nuc-detail-val">
                <div style={{marginBottom:12}}>
                  <span style={{color:'#ff3b3b',fontFamily:'IBM Plex Mono,monospace',fontSize:28,fontWeight:600, textShadow: '0 0 12px rgba(255,59,59,0.4)'}}>
                    {weapon.yield.min !== weapon.yield.max
                      ? `${weapon.yield.min}–${weapon.yield.max}`
                      : weapon.yield.max} {weapon.yield.unit}
                  </span>
                  <span style={{color:'#8892a4',fontSize:14,marginLeft:12}}>
                    {weapon.yield.max >= 1000
                      ? `(${(weapon.yield.max/1000).toFixed(1)} MT)`
                      : ''}
                  </span>
                </div>
                <div style={{fontSize:15,color:'#cdd6f4',lineHeight:1.6}}>{weapon.payload}</div>
              </div>
              <div className="nuc-detail-label" style={{marginTop:24}}>Launch Platform</div>
              <div className="nuc-detail-val" style={{fontSize:15,color:'#cdd6f4'}}>{weapon.launchMethod}</div>
            </div>
          </div>

          {/* Blast impact zones */}
          {weapon.blast_radius && (
            <div className="nuc-blast-zones">
              <div className="nuc-blast-title"><Icons.Warning /> Blast Impact Zones (Max Yield Detonation)</div>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
                {BLAST_ZONES.map(z => (
                  <div key={z.key} className="nuc-blast-row">
                    <div className="nuc-blast-dot" style={{background:z.color, color: z.color}} />
                    <div className="nuc-blast-zone-name">{z.label}</div>
                    <div className="nuc-blast-km">{weapon.blast_radius[z.key] ?? '?'} km radius</div>
                    <div className="nuc-blast-desc">{z.desc}</div>
                  </div>
                ))}
              </div>
              {/* Visual scale */}
              <div style={{background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:8,padding:'20px 24px'}}>
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'#8892a4',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:16}}>
                  Relative Impact Scale
                </div>
                {BLAST_ZONES.map(z => {
                  const maxR = weapon.blast_radius?.thermal || 1;
                  const pct  = Math.max(4, ((weapon.blast_radius?.[z.key] || 0) / maxR) * 100);
                  return (
                    <div key={z.key} style={{display:'flex',alignItems:'center',gap:16,marginBottom:10}}>
                      <div style={{width:100,fontSize:11,color:'#8892a4',textAlign:'right',flexShrink:0,fontFamily:'IBM Plex Mono,monospace'}}>{weapon.blast_radius[z.key] ?? '?'}km</div>
                      <div style={{flex:1,height:12,background:'rgba(255,255,255,0.05)',borderRadius:2,overflow:'hidden'}}>
                        <div style={{width:`${pct}%`,height:'100%',background:z.color,borderRadius:2,opacity:0.9,transition:'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'}} />
                      </div>
                      <div style={{width:100,fontSize:11,color:'#8892a4',fontFamily:'IBM Plex Mono,monospace'}}>{z.label.split(' ')[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Launch sequence */}
          {weapon.launchSteps && weapon.launchSteps.length > 0 && (
            <div className="nuc-launch-steps">
              <div className="nuc-detail-label">Tactical Launch Sequence</div>
              {weapon.launchSteps.map((step, i) => (
                <div key={i} className="nuc-step">
                  <div className="nuc-step-num">0{i + 1}</div>
                  <div className="nuc-step-text">{step}</div>
                </div>
              ))}
            </div>
          )}

          {/* Key features */}
          {weapon.features && weapon.features.length > 0 && (
            <div className="nuc-features">
              <div className="nuc-detail-label">Strategic Capabilities</div>
              {weapon.features.map((f, i) => (
                <div key={i} className="nuc-feature">
                  <div className="nuc-feature-bullet"><Icons.ChevronRight /></div>
                  <div className="nuc-feature-text">{f}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Main Nuclear page ────────────────────────────────────────────────────────
export default function Nuclear() {
  injectCSS('nuclear-styles', CSS);

  const [activeCountry, setActiveCountry] = useState(NUCLEAR_COUNTRIES[0]);
  const [view, setView] = useState('detail'); // 'detail' | 'overview'
  const contentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeCountry]);

  return (
    <div className="nuc-page-wrapper">
      <div className="nuc-content-layer">
        <Navbar />
        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <AdBanner position="top" />
        )}

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="nuc-hero">
          <div style={{position:'relative',zIndex:2}}>
            <div className="nuc-hero-badge">
              <span className="pulse-red" style={{ display: 'flex', width: 8, height: 8, background: '#ff3b3b' }} />
              Nuclear Intelligence Database · LOG: {NUCLEAR_SUMMARY.lastUpdated.toUpperCase()}
            </div>
            <h1 className="nuc-hero-title">
              STRATEGIC<br/><span>ARSENAL</span><br/>INTELLIGENCE
            </h1>
            <p className="nuc-hero-sub">
              Classified metrics on all 9 nuclear-armed states — warhead counts, delivery systems, yields, blast radii, and launch sequences. 
            </p>
            <div className="nuc-stats-bar">
              {[
                { val: NUCLEAR_SUMMARY.totalWarheads.toLocaleString(), label: 'Total Warheads' },
                { val: NUCLEAR_SUMMARY.deployedWarheads.toLocaleString(), label: 'Active Deployment' },
                { val: NUCLEAR_SUMMARY.countries, label: 'Nuclear States' },
                { val: '~30 min', label: 'ICBM Flight Time' },
              ].map(s => (
                <div key={s.label} className="nuc-stat">
                  <span className="nuc-stat-val">{s.val}</span>
                  <span className="nuc-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* View toggle */}
            <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:32, flexWrap: 'wrap'}}>
              {['detail','overview'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  background: view===v ? 'rgba(255,59,59,0.15)' : 'rgba(0,0,0,0.5)',
                  border: `1px solid ${view===v ? 'rgba(255,59,59,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: view===v ? '#ff8080' : '#8892a4',
                  padding: '12px 24px', borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  transition: 'all 200ms ease',
                  boxShadow: view===v ? '0 0 15px rgba(255,59,59,0.2)' : 'none',
                }}>
                  {v === 'detail' ? '🔍 STATE DOSSIER' : '📊 GLOBAL OVERVIEW'}
                </button>
              ))}
              <button onClick={() => navigate('/')} style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.4)',
                color: '#00d4ff', padding: '12px 24px', borderRadius: 4,
                cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                transition: 'all 200ms ease',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Icons.Globe /> MAP VISUALIZATION
              </button>
            </div>
          </div>
        </div>

        {/* ── Overview mode ─────────────────────────────────────────────── */}
        {view === 'overview' && (
          <div className="nuc-comparison nuc-animate">
            <div className="nuc-section-title"><Icons.Warning /> Global Arsenal Matrix</div>
            <div className="nuc-compare-grid">
              {[...NUCLEAR_COUNTRIES].sort((a,b) => b.warheads.total - a.warheads.total).map(c => (
                <div key={c.iso3} className="nuc-compare-card" onClick={() => { setActiveCountry(c); setView('detail'); }}>
                  <div className="nuc-cc-top">
                    <span className="nuc-cc-flag">{c.flag}</span>
                    <div>
                      <div className="nuc-cc-name">{c.name}</div>
                      <div className="nuc-cc-total">{c.warheads.total.toLocaleString()} WARHEADS</div>
                    </div>
                  </div>
                  <div className="nuc-cc-bar">
                    <div className="nuc-cc-fill" style={{width:`${(c.warheads.total/MAX_WARHEADS)*100}%`}} />
                  </div>
                  <div className="nuc-cc-rows">
                    {[
                      ['Deployed',  c.warheads.deployed],
                      ['Reserve',   c.warheads.reserve],
                      ['Retired',   c.warheads.retired],
                      ['Systems',   c.weapons?.length + ' active types'],
                      ['First Test',c.firstTest.date.split(' ').slice(-1)[0]],
                    ].map(([l,v]) => (
                      <div key={l} className="nuc-cc-row">
                        <span className="nuc-cc-row-label">{l}</span>
                        <span className="nuc-cc-row-val">{typeof v === 'number' ? v.toLocaleString() : v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Detail mode ───────────────────────────────────────────────── */}
        {view === 'detail' && (
          <div className="nuc-layout">

            {/* Sidebar */}
            <div className="nuc-sidebar">
              <div className="nuc-sidebar-title">TARGET NATION</div>
              {[...NUCLEAR_COUNTRIES].sort((a,b) => b.warheads.total - a.warheads.total).map(c => (
                <button
                  key={c.iso3}
                  className={`nuc-country-btn ${activeCountry.iso3 === c.iso3 ? 'active' : ''}`}
                  onClick={() => setActiveCountry(c)}
                >
                  <span className="nuc-country-flag">{c.flag}</span>
                  <div className="nuc-country-info">
                    <div className="nuc-country-name">{c.name}</div>
                    <div className="nuc-country-count">{c.warheads.total.toLocaleString()} WARHEADS</div>
                    <div className="nuc-country-bar">
                      <div className="nuc-country-bar-fill" style={{width:`${(c.warheads.total/MAX_WARHEADS)*100}%`}} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className="nuc-content nuc-animate" ref={contentRef} key={activeCountry.iso3}>

              {/* Country header */}
              <div className="nuc-country-header">
                <div className="nuc-ch-flag">{activeCountry.flag}</div>
                <div className="nuc-ch-main">
                  <div className="nuc-ch-name">{activeCountry.name.toUpperCase()}</div>
                  <div className="nuc-ch-doctrine">"{activeCountry.doctrine}"</div>
                  <div className="nuc-ch-tags">
                    {activeCountry.treaties?.map(t => <span key={t} className="nuc-tag">{t}</span>)}
                    {activeCountry.deliverySystems?.map(d => <span key={d} className="nuc-tag red">{d}</span>)}
                  </div>
                  <div className="nuc-ch-stats">
                    {[
                      { val: activeCountry.warheads.total.toLocaleString(), label: 'Total Inventory' },
                      { val: activeCountry.warheads.deployed.toLocaleString(), label: 'Active Deployed' },
                      { val: activeCountry.warheads.reserve.toLocaleString(), label: 'Stockpiled' },
                      { val: activeCountry.warheads.retired.toLocaleString(), label: 'Retired / Queued' },
                    ].map(s => (
                      <div key={s.label} className="nuc-mini-stat">
                        <span className="nuc-mini-val">{s.val}</span>
                        <div className="nuc-mini-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* First test */}
              <div className="nuc-first-test">
                <div className="nuc-ft-icon"><Icons.Nuclear /></div>
                <div>
                  <div className="nuc-ft-label">Initial Detonation Event</div>
                  <div className="nuc-ft-detail">{activeCountry.firstTest.codename} — {activeCountry.firstTest.yield} · {activeCountry.firstTest.date.toUpperCase()}</div>
                  <div className="nuc-ft-meta">COORD: {activeCountry.firstTest.location.toUpperCase()}</div>
                </div>
              </div>

              {/* Notable tests */}
              {activeCountry.notableTests && (
                <div style={{
                  padding:'16px 20px',marginBottom:32,
                  background:'rgba(255,170,0,0.05)',border:'1px solid rgba(255,170,0,0.2)',
                  borderRadius:8,fontSize:15,color:'#cdd6f4',lineHeight:1.6,
                }}>
                  <span style={{color:'#ffaa00',fontFamily:'IBM Plex Mono,monospace',fontSize:11,fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',marginRight:12}}>NOTABLE: </span>
                  {activeCountry.notableTests}
                </div>
              )}

              {/* Weapons */}
              <div className="nuc-section-title">
                <Icons.Missile /> DEPLOYED DELIVERY SYSTEMS ({activeCountry.weapons?.length || 0})
              </div>
              <div className="nuc-weapons-grid">
                {activeCountry.weapons?.map(w => (
                  <WeaponCard key={w.id} weapon={w} />
                ))}
              </div>

            </div>
          </div>
        )}

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <AdBanner position="bottom" />
        )}
        <div className="nuc-source">
          [ SOURCE LOG ] FAS Nuclear Notebook 2024 · SIPRI Yearbook 2024 · Bulletin of Atomic Scientists · Arms Control Association · IISS Military Balance 2024 · Declassified START treaty data
        </div>
      </div>
    </div>
  );
}