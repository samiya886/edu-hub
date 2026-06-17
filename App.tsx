import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView, WebViewNavigation } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';

const WEBSITE_URL = 'https://edu-hub-production.up.railway.app';
const WEBSITE_HOST = new URL(WEBSITE_URL).host;
const WEBSITE_ORIGIN = new URL(WEBSITE_URL).origin;

const MOBILE_OPTIMIZATION_CSS = `
    @media (max-width: 640px) {
      :root {
        --eduhub-mobile-x: 14px;
        --eduhub-radius: 16px;
      }

      html,
      body,
      #root {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }

      body {
        font-size: 14px !important;
        line-height: 1.45 !important;
        background: #f8fafc !important;
      }

      main,
      section,
      header,
      footer {
        max-width: 100vw !important;
      }

      section {
        padding-top: 22px !important;
        padding-bottom: 22px !important;
      }

      section > div,
      main > div,
      header > div,
      footer > div {
        width: 100% !important;
        max-width: 100vw !important;
        padding-left: var(--eduhub-mobile-x) !important;
        padding-right: var(--eduhub-mobile-x) !important;
      }

      h1,
      .text-6xl,
      .text-7xl,
      .text-8xl,
      [class*="text-[92px]"] {
        font-size: clamp(30px, 8.6vw, 42px) !important;
        line-height: 1.02 !important;
        letter-spacing: -0.02em !important;
      }

      h2,
      .text-5xl,
      .text-4xl {
        font-size: clamp(22px, 6.2vw, 30px) !important;
        line-height: 1.12 !important;
        letter-spacing: -0.01em !important;
      }

      h3,
      .text-3xl,
      .text-2xl {
        font-size: clamp(18px, 4.9vw, 22px) !important;
        line-height: 1.18 !important;
      }

      p,
      .text-lg,
      .text-base {
        font-size: 14px !important;
        line-height: 1.48 !important;
      }

      .text-sm {
        font-size: 13px !important;
        line-height: 1.42 !important;
      }

      .tracking-widest,
      [class*="tracking-[0.22em]"],
      [class*="tracking-[0.25em]"] {
        letter-spacing: 0.12em !important;
      }

      [class*="min-h-screen"],
      [class*="min-h-[calc"],
      [class*="lg:min-h"] {
        min-height: auto !important;
      }

      [class*="py-20"],
      [class*="py-32"],
      [class*="py-28"],
      [class*="py-24"],
      [class*="py-16"],
      [class*="py-12"],
      [class*="pt-32"],
      [class*="pt-28"],
      [class*="pt-24"],
      [class*="pt-20"],
      [class*="pb-32"],
      [class*="pb-28"],
      [class*="pb-24"],
      [class*="pb-20"],
      [class*="p-16"],
      [class*="p-12"],
      [class*="p-10"],
      [class*="p-8"] {
        padding-top: 22px !important;
        padding-bottom: 22px !important;
      }

      [class*="px-10"],
      [class*="px-8"],
      [class*="p-7"],
      [class*="p-6"] {
        padding-left: 14px !important;
        padding-right: 14px !important;
      }

      [class*="p-5"],
      [class*="p-4"] {
        padding: 12px !important;
      }

      [class*="mb-24"],
      [class*="mb-20"],
      [class*="mb-16"],
      [class*="mb-12"],
      [class*="mt-32"],
      [class*="mt-28"],
      [class*="mt-24"],
      [class*="mt-20"],
      [class*="mt-16"],
      [class*="mt-12"] {
        margin-top: 18px !important;
        margin-bottom: 18px !important;
      }

      [class*="gap-16"],
      [class*="gap-12"],
      [class*="gap-10"],
      [class*="gap-8"],
      [class*="gap-6"] {
        gap: 12px !important;
      }

      [class*="rounded-[50px]"],
      [class*="rounded-[40px]"],
      [class*="rounded-[36px]"],
      [class*="rounded-[35px]"],
      [class*="rounded-[32px]"],
      [class*="rounded-[28px]"],
      [class*="rounded-[26px]"],
      [class*="rounded-3xl"] {
        border-radius: var(--eduhub-radius) !important;
      }

      [class*="shadow-2xl"],
      [class*="shadow-xl"],
      [class*="shadow-lg"],
      [class*="shadow-[0_"] {
        box-shadow: 0 12px 28px rgba(10, 74, 68, 0.10) !important;
      }

      .grid {
        gap: 12px !important;
      }

      .grid[class*="grid-cols"],
      [class*="sm:grid-cols"],
      [class*="md:grid-cols"],
      [class*="lg:grid-cols"] {
        grid-template-columns: 1fr !important;
      }

      section .grid:has(> :nth-child(3)),
      main .grid:has(> :nth-child(3)) {
        display: flex !important;
        gap: 12px !important;
        overflow-x: auto !important;
        scroll-snap-type: x proximity !important;
        padding-bottom: 4px !important;
        -webkit-overflow-scrolling: touch !important;
      }

      section .grid:has(> :nth-child(3)) > *,
      main .grid:has(> :nth-child(3)) > * {
        flex: 0 0 min(78vw, 292px) !important;
        min-width: min(78vw, 292px) !important;
        scroll-snap-align: start !important;
      }

      section .flex > [class*="rounded-full"][class*="bg-gray-50"][class*="border"] {
        flex: 0 0 100% !important;
        min-width: 0 !important;
        justify-content: center !important;
        text-align: center !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      section .flex > [class*="rounded-full"][class*="bg-gray-50"][class*="border"] svg,
      section .flex > [class*="rounded-full"][class*="bg-gray-50"][class*="border"] span {
        flex-shrink: 0 !important;
      }

      article,
      [class*="bg-white"][class*="border"],
      [class*="bg-white"][class*="shadow"],
      [class*="bg-gray-50"][class*="border"] {
        border-radius: 14px !important;
      }

      img,
      video {
        max-width: 100% !important;
        height: auto !important;
        object-fit: cover !important;
      }

      [class*="h-[520px]"],
      [class*="h-[500px]"],
      [class*="h-[450px]"],
      [class*="h-[430px]"],
      [class*="h-[400px]"],
      [class*="h-96"],
      [class*="h-80"],
      [class*="h-72"],
      [class*="h-64"] {
        height: clamp(180px, 52vw, 240px) !important;
      }

      [class*="h-56"],
      [class*="h-48"],
      [class*="h-40"] {
        height: clamp(130px, 42vw, 180px) !important;
      }

      button,
      a[role="button"],
      input[type="submit"] {
        min-height: 42px !important;
        border-radius: 12px !important;
      }

      button[class*="py-4"],
      a[class*="py-4"],
      button[class*="px-6"],
      a[class*="px-6"] {
        padding: 10px 14px !important;
        font-size: 13px !important;
      }

      input,
      select,
      textarea {
        min-height: 44px !important;
        border-radius: 12px !important;
        font-size: 16px !important;
      }

      [class*="absolute"][class*="blur"],
      [class*="rounded-full"][class*="blur"],
      [class*="opacity-30"][class*="blur"] {
        display: none !important;
      }

      nav,
      header {
        min-height: auto !important;
      }

      body[data-eduhub-route="resources"] {
        background: #ffffff !important;
      }

      body[data-eduhub-route="resources"] section,
      body[data-eduhub-route="resources"] main > div,
      body[data-eduhub-route="resources"] [class*="space-y-"] {
        gap: 14px !important;
      }

      body[data-eduhub-route="resources"] [class*="min-h-[560px]"],
      body[data-eduhub-route="resources"] [class*="min-h-[600px]"],
      body[data-eduhub-route="resources"] [class*="min-h-[650px]"],
      body[data-eduhub-route="resources"] [class*="min-h-[700px]"] {
        min-height: auto !important;
      }

      body[data-eduhub-route="resources"] [class*="max-w-7xl"],
      body[data-eduhub-route="resources"] [class*="max-w-6xl"],
      body[data-eduhub-route="resources"] [class*="max-w-5xl"],
      body[data-eduhub-route="resources"] [class*="max-w-4xl"] {
        max-width: 100vw !important;
      }

      body[data-eduhub-route="resources"] h1 {
        font-size: clamp(24px, 6.6vw, 32px) !important;
      }

      body[data-eduhub-route="resources"] h2 {
        font-size: clamp(20px, 5.8vw, 26px) !important;
      }

      body[data-eduhub-route="resources"] [class*="rounded-[50px]"],
      body[data-eduhub-route="resources"] [class*="rounded-[40px]"],
      body[data-eduhub-route="resources"] [class*="rounded-[36px]"],
      body[data-eduhub-route="resources"] [class*="rounded-[32px]"] {
        border-radius: 18px !important;
      }

      body[data-eduhub-route="resources"] input[type="text"],
      body[data-eduhub-route="resources"] input[type="search"] {
        width: 100% !important;
        min-width: 0 !important;
      }

      body[data-eduhub-route="resources"] button,
      body[data-eduhub-route="resources"] select {
        flex-shrink: 0 !important;
        white-space: nowrap !important;
      }

      body[data-eduhub-route="resources"] [class*="overflow-hidden"]:has(button),
      body[data-eduhub-route="resources"] [class*="overflow-hidden"]:has(input),
      body[data-eduhub-route="resources"] [class*="overflow-hidden"]:has(select) {
        overflow: visible !important;
      }

      body[data-eduhub-route="resources"] .grid:has(button):has(> :nth-child(3)),
      body[data-eduhub-route="resources"] .flex:has(button):has(> :nth-child(3)) {
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        gap: 8px !important;
        padding-bottom: 6px !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
      }

      body[data-eduhub-route="resources"] .grid:has(button):has(> :nth-child(3))::-webkit-scrollbar,
      body[data-eduhub-route="resources"] .flex:has(button):has(> :nth-child(3))::-webkit-scrollbar {
        display: none !important;
      }

      body[data-eduhub-route="resources"] .grid:has(button):has(> :nth-child(3)) > *,
      body[data-eduhub-route="resources"] .flex:has(button):has(> :nth-child(3)) > * {
        flex: 0 0 auto !important;
        min-width: max-content !important;
      }

      body[data-eduhub-route="resources"] .mobile-carousel::after {
        display: none !important;
      }

      body[data-eduhub-route="resources"] .mobile-scroll-track {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        scroll-snap-type: none !important;
      }

      body[data-eduhub-route="resources"] .mobile-scroll-track > * {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        flex: 1 1 auto !important;
        scroll-snap-align: none !important;
      }

      body[data-eduhub-route="resources"] [class*="min-w-[760px]"],
      body[data-eduhub-route="resources"] [class*="min-w-[850px]"] {
        min-width: 0 !important;
        width: 100% !important;
      }

      body[data-eduhub-route="resources"] select,
      body[data-eduhub-route="resources"] [role="combobox"] {
        width: 100% !important;
        max-width: 100% !important;
      }

      body[data-eduhub-route="resources"] img {
        max-height: 220px !important;
      }

      body[data-eduhub-route="resources"] [class*="py-20"] {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
      }

      body[data-eduhub-route="resources"] [class*="mt-20"],
      body[data-eduhub-route="resources"] [class*="mb-20"] {
        margin-top: 16px !important;
        margin-bottom: 16px !important;
      }

      .mobile-carousel.mobile-scroll-track:has(> div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"]) {
        display: flex !important;
        flex-wrap: nowrap !important;
        gap: 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 0 0 8px 0 !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        scroll-snap-type: x mandatory !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
      }

      .mobile-carousel.mobile-scroll-track:has(> div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"])::-webkit-scrollbar {
        display: none !important;
      }

      .mobile-carousel.mobile-scroll-track:has(> div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"])::after {
        display: none !important;
      }

      .mobile-carousel.mobile-scroll-track:has(> div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"]) > div {
        width: min(82vw, 292px) !important;
        min-width: min(82vw, 292px) !important;
        max-width: min(82vw, 292px) !important;
        flex: 0 0 min(82vw, 292px) !important;
        scroll-snap-align: start !important;
      }

      .mobile-carousel.mobile-scroll-track > div[class*="bg-white"][class*="border"] > div[class*="absolute"][class*="bottom-0"][class*="h-1"] {
        display: none !important;
      }

      div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"] > div.grid[class*="grid-cols-3"]:has(> button:nth-child(3)) {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 6px !important;
        width: 100% !important;
        overflow: visible !important;
        padding-bottom: 0 !important;
        scroll-snap-type: none !important;
      }

      div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"] > div.grid[class*="grid-cols-3"]:has(> button:nth-child(3)) > button {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 36px !important;
        flex: 1 1 0 !important;
        gap: 4px !important;
        padding: 8px 4px !important;
        border-radius: 10px !important;
        font-size: 10px !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
      }

      div[class*="rounded-3xl"][class*="bg-white"][class*="shadow-sm"] > div.grid[class*="grid-cols-3"]:has(> button:nth-child(3)) > button svg {
        width: 13px !important;
        height: 13px !important;
        flex: 0 0 13px !important;
      }

      body {
        padding-bottom: 64px !important;
      }

      body[data-eduhub-route="home"] main > section:nth-of-type(n+3) {
        display: none !important;
      }

      body[data-eduhub-route="home"] main,
      body[data-eduhub-route="home"] section {
        overflow-x: hidden !important;
      }

      body[data-eduhub-route="home"] section {
        padding-top: 18px !important;
        padding-bottom: 18px !important;
      }

      body[data-eduhub-route="home"] section:first-of-type {
        min-height: auto !important;
        padding-top: 22px !important;
        padding-bottom: 18px !important;
      }

      body[data-eduhub-route="home"] section:first-of-type h1 {
        max-width: 92vw !important;
        font-size: clamp(30px, 8vw, 38px) !important;
        line-height: 1.06 !important;
      }

      body[data-eduhub-route="home"] section:first-of-type p {
        max-width: 92vw !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
      }

      body[data-eduhub-route="home"] section:first-of-type .grid:has(> :nth-child(3)) > :nth-child(n+3),
      body[data-eduhub-route="home"] section:first-of-type .flex:has(> :nth-child(4)) > :nth-child(n+4) {
        display: none !important;
      }

      .eduhub-native-bottom-nav {
        position: fixed !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 2147483000 !important;
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 4px !important;
        min-height: 64px !important;
        padding: 6px 8px !important;
        border: 0 !important;
        border-top: 1px solid rgba(10, 74, 68, 0.10) !important;
        border-radius: 0 !important;
        background: #ffffff !important;
        box-shadow: 0 -8px 24px rgba(10, 74, 68, 0.12) !important;
        backdrop-filter: blur(18px) !important;
        -webkit-backdrop-filter: blur(18px) !important;
      }

      .eduhub-native-bottom-nav button {
        min-height: 46px !important;
        border: 0 !important;
        border-radius: 13px !important;
        background: transparent !important;
        color: #64748b !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        padding: 5px 2px !important;
        font-size: 10px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      .eduhub-native-bottom-nav button[data-active="true"] {
        background: #0a4a44 !important;
        color: #ffffff !important;
      }

      .eduhub-native-bottom-nav svg {
        width: 18px !important;
        height: 18px !important;
        flex: 0 0 18px !important;
      }

      [data-eduhub-menu-hidden="true"] {
        display: none !important;
      }

      .eduhub-mobile-menu-actions {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 8px !important;
        width: 100% !important;
        margin-top: 10px !important;
        padding: 10px 0 0 !important;
        border-top: 1px solid rgba(10, 74, 68, 0.08) !important;
      }

      .eduhub-mobile-menu-link {
        min-height: 40px !important;
        border: 1px solid rgba(10, 74, 68, 0.12) !important;
        border-radius: 12px !important;
        background: #ffffff !important;
        color: #0a4a44 !important;
        padding: 9px 10px !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-align: center !important;
      }

      .eduhub-mobile-menu-link[data-variant="highlight"] {
        border-color: #ff9f1c !important;
        background: #ff9f1c !important;
        color: #061826 !important;
        box-shadow: 0 10px 20px rgba(255, 159, 28, 0.22) !important;
      }

      .eduhub-mobile-menu-auth-action {
        min-height: 40px !important;
        border: 0 !important;
        border-radius: 12px !important;
        background: #0a4a44 !important;
        color: #ffffff !important;
        padding: 9px 14px !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      .eduhub-mobile-menu-auth-secondary {
        background: #ff9f1c !important;
        color: #061826 !important;
      }

      body[data-eduhub-route="home"] footer {
        margin-top: 0 !important;
        padding: 18px 16px 82px !important;
        border-radius: 18px 18px 0 0 !important;
        background: #061826 !important;
        color: #ffffff !important;
        text-align: center !important;
      }

      body[data-eduhub-route="home"] footer > * {
        display: none !important;
      }

      body[data-eduhub-route="home"] footer::before {
        content: 'EduHub';
        display: block;
        color: #ffffff;
        font-size: 20px;
        font-weight: 900;
        letter-spacing: 0;
      }

      body[data-eduhub-route="home"] footer::after {
        content: 'Notes, papers, and study access in one app.';
        display: block;
        margin-top: 6px;
        color: rgba(255, 255, 255, 0.72);
        font-size: 12px;
        font-weight: 700;
      }
    }

    @media (min-width: 641px) {
      .eduhub-native-bottom-nav {
        display: none !important;
      }
    }
`;

const MOBILE_OPTIMIZATION_SCRIPT = `
(function () {
  var STYLE_ID = 'eduhub-mobile-compact-style';
  var API_ORIGIN = ${JSON.stringify(WEBSITE_ORIGIN)};

  function absoluteApiUrl(input) {
    if (typeof input !== 'string') return input;
    if (input.indexOf('/api/') === 0) return API_ORIGIN + input;
    if (input.indexOf('http://edu-hub-production.up.railway.app/api/') === 0) {
      return input.replace('http://', 'https://');
    }
    return input;
  }

  function installFetchBridge() {
    if (!window.fetch || window.__eduhubFetchBridgeInstalled) return;

    var originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      if (typeof input === 'string') {
        return originalFetch(absoluteApiUrl(input), init);
      }

      if (input && typeof input.url === 'string') {
        var nextUrl = absoluteApiUrl(input.url);
        if (nextUrl !== input.url) {
          input = new Request(nextUrl, input);
        }
      }

      return originalFetch(input, init);
    };

    window.__eduhubFetchBridgeInstalled = true;
  }

  function syncRouteClass() {
    var path = window.location && window.location.pathname ? window.location.pathname : '';
    var route = path === '/notes' || path === '/papers' ? 'resources' : (path === '/' || path === '/home' ? 'home' : 'default');

    if (document.body) {
      document.body.setAttribute('data-eduhub-route', route);
      document.body.setAttribute('data-eduhub-path', path || '/');
    }
  }

  function getStoredUserRole() {
    var storageKeys = ['user', 'authUser', 'eduhub_user', 'eduhub-user'];
    var storageAreas = [window.localStorage, window.sessionStorage];

    for (var areaIndex = 0; areaIndex < storageAreas.length; areaIndex += 1) {
      var storage = storageAreas[areaIndex];
      if (!storage) continue;

      for (var keyIndex = 0; keyIndex < storageKeys.length; keyIndex += 1) {
        try {
          var rawValue = storage.getItem(storageKeys[keyIndex]);
          if (!rawValue) continue;

          var parsed = JSON.parse(rawValue);
          var role = parsed && (parsed.role || (parsed.user && parsed.user.role));
          if (typeof role === 'string' && role) return role.toLowerCase();
        } catch (error) {}
      }
    }

    return '';
  }

  function normalizeUnsupportedRoutes() {
    var path = window.location && window.location.pathname ? window.location.pathname : '';
    if (path !== '/profile') return;

    var role = getStoredUserRole();
    var nextPath = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin' : '/student';
    history.replaceState(history.state || {}, document.title, nextPath + (window.location.search || '') + (window.location.hash || ''));
    syncRouteClass();
    try {
      window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    } catch (error) {
      window.dispatchEvent(new Event('popstate'));
    }
  }

  function isMobileAppView() {
    return !window.matchMedia || window.matchMedia('(max-width: 640px)').matches;
  }

  function isLoggedIn() {
    try {
      return !!(window.localStorage && window.localStorage.getItem('token'));
    } catch (error) {
      return false;
    }
  }

  function getProfilePath() {
    if (!isLoggedIn()) return '/auth';

    var role = getStoredUserRole();
    if (role === 'teacher') return '/teacher?section=profile';
    if (role === 'admin') return '/admin';
    return '/student?section=profile';
  }

  function dispatchRouteUpdate() {
    try {
      window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    } catch (error) {
      window.dispatchEvent(new Event('popstate'));
    }
  }

  function navigateInApp(path) {
    var nextPath = path === '/profile' ? getProfilePath() : path;
    history.pushState({}, document.title, nextPath);
    dispatchRouteUpdate();
    window.setTimeout(handleRouteChange, 0);
  }

  function logoutUser() {
    try {
      ['token', 'user', 'authToken', 'authUser', 'eduhub_token', 'eduhub_user', 'eduhub-user'].forEach(function (key) {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });
    } catch (error) {}

    navigateInApp('/home');
  }

  function normalizeMenuLabel(value) {
    return String(value || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  }

  function cleanMobileMenu() {
    if (!isMobileAppView()) return;

    var items = document.querySelectorAll('header a, header button, nav a, nav button, [role="dialog"] a, [role="dialog"] button');

    Array.prototype.forEach.call(items, function (item) {
      if (item.closest && item.closest('#eduhub-mobile-menu-actions')) return;

      var label = normalizeMenuLabel(item.textContent || item.getAttribute('aria-label') || item.getAttribute('title'));
      var href = item.getAttribute && item.getAttribute('href') ? item.getAttribute('href') : '';
      var path = '';

      try {
        path = href ? new URL(href, window.location.origin).pathname : '';
      } catch (error) {}

      if (!label && !path) return;
      if (label.indexOf('menu') >= 0 || label.indexOf('close') >= 0) return;

      item.setAttribute('data-eduhub-menu-hidden', 'true');
    });
  }

  function createMenuButton(id, label, className, onPress, parent, variant) {
    var root = parent || document;
    var button = root.querySelector ? root.querySelector('#' + id) : document.getElementById(id);
    if (!button) {
      button = document.createElement('button');
      button.id = id;
      button.type = 'button';
    }

    button.className = className;
    button.textContent = label;
    button.onclick = onPress;
    if (variant) {
      button.setAttribute('data-variant', variant);
    } else {
      button.removeAttribute('data-variant');
    }
    return button;
  }

  function findMobileMenuContainer() {
    var candidates = [
      document.querySelector('[role="dialog"] nav'),
      document.querySelector('[role="dialog"]'),
      document.querySelector('header nav'),
      document.querySelector('nav'),
      document.querySelector('header')
    ];

    for (var index = 0; index < candidates.length; index += 1) {
      if (candidates[index]) return candidates[index];
    }

    return null;
  }

  function installExactMobileMenu() {
    if (!isMobileAppView()) return;

    var container = findMobileMenuContainer();
    if (!container) return;

    var existing = container.querySelector('#eduhub-mobile-menu-actions');
    var actions = existing || document.createElement('div');
    actions.id = 'eduhub-mobile-menu-actions';
    actions.className = 'eduhub-mobile-menu-actions';
    actions.innerHTML = '';

    var loggedIn = isLoggedIn();
    var menuItems = [
      { id: 'eduhub-menu-home', label: 'Home', path: '/home' },
      { id: 'eduhub-menu-notes', label: 'Notes', path: '/notes' },
      { id: 'eduhub-menu-papers', label: 'Papers', path: '/papers' }
    ];

    if (loggedIn) {
      menuItems.push({ id: 'eduhub-menu-logout', label: 'Logout', action: logoutUser, variant: 'highlight' });
    } else {
      menuItems.push({ id: 'eduhub-menu-signin', label: 'Sign In', path: '/auth' });
      menuItems.push({ id: 'eduhub-menu-signup', label: 'Sign Up', path: '/auth?mode=signup', variant: 'highlight' });
    }

    menuItems.forEach(function (item) {
      var button = createMenuButton(item.id, item.label, 'eduhub-mobile-menu-link', function () {
        if (item.action) {
          item.action();
        } else {
          navigateInApp(item.path);
        }
      }, actions, item.variant);
      actions.appendChild(button);
    });

    if (!existing) container.appendChild(actions);
  }

  function installLegacyMobileMenuAuthAction() {
    if (!isMobileAppView()) return;

    var existing = document.getElementById('eduhub-mobile-menu-auth-action');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var signOut = document.getElementById('eduhub-mobile-menu-signout-action');
    if (signOut && signOut.parentNode) signOut.parentNode.removeChild(signOut);

    var logout = document.getElementById('eduhub-mobile-menu-logout-action');
    if (logout && logout.parentNode) logout.parentNode.removeChild(logout);
  }

  function installBottomNav() {
    if (!isMobileAppView()) return;

    var nav = document.getElementById('eduhub-native-bottom-nav');
    if (!nav) {
      nav = document.createElement('div');
      nav.id = 'eduhub-native-bottom-nav';
      nav.className = 'eduhub-native-bottom-nav';
      document.body.appendChild(nav);
    }

    var path = window.location.pathname || '/';
    var loggedIn = isLoggedIn();
    var authItem = loggedIn
      ? { key: 'logout', label: 'Logout', path: '/home', icon: 'M16 17l5-5-5-5M21 12H9M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8' }
      : { key: 'signin', label: 'Sign In', path: '/auth', icon: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3' };
    var items = [
      { key: 'home', label: 'Home', path: '/home', icon: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z' },
      { key: 'notes', label: 'Notes', path: '/notes', icon: 'M5 4h14v16H5V4Zm4 4h6M9 12h6M9 16h4' },
      { key: 'papers', label: 'Papers', path: '/papers', icon: 'M7 3h8l4 4v14H7V3Zm8 0v5h5M9 13h8M9 17h8' },
      authItem
    ];

    nav.innerHTML = '';
    items.forEach(function (item) {
      var active =
        (item.key === 'home' && (path === '/' || path === '/home')) ||
        (item.key === 'notes' && path === '/notes') ||
        (item.key === 'papers' && path === '/papers') ||
        (item.key === 'signin' && path === '/auth');

      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-active', active ? 'true' : 'false');
      button.setAttribute('aria-label', item.label);
      button.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
        item.icon +
        '"></path></svg><span>' +
        item.label +
        '</span>';
      button.addEventListener('click', function () {
        if (item.key === 'logout') {
          logoutUser();
        } else {
          navigateInApp(item.path);
        }
      });
      nav.appendChild(button);
    });
  }

  function installMobileNavigation() {
    if (!document.body) return;

    cleanMobileMenu();
    installLegacyMobileMenuAuthAction();
    installExactMobileMenu();
    installBottomNav();
  }

  function handleRouteChange() {
    normalizeUnsupportedRoutes();
    syncRouteClass();
    window.setTimeout(installMobileNavigation, 80);
  }

  function installRouteObserver() {
    if (window.__eduhubRouteObserverInstalled) return;

    var originalPushState = history.pushState;
    var originalReplaceState = history.replaceState;
    history.pushState = function () {
      var result = originalPushState.apply(this, arguments);
      window.setTimeout(handleRouteChange, 0);
      return result;
    };
    history.replaceState = function () {
      var result = originalReplaceState.apply(this, arguments);
      window.setTimeout(handleRouteChange, 0);
      return result;
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.__eduhubRouteObserverInstalled = true;
  }

  function injectStyle() {
    var target = document.head || document.documentElement || document.body;
    if (!target) {
      window.setTimeout(injectStyle, 50);
      return true;
    }

    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = ${JSON.stringify(MOBILE_OPTIMIZATION_CSS)};
      target.appendChild(style);
    }

    installFetchBridge();
    installRouteObserver();
    normalizeUnsupportedRoutes();
    syncRouteClass();
    installMobileNavigation();
    window.setInterval(installMobileNavigation, 1500);
    return true;
  }

  return injectStyle();
})();
true;
`;

function normalizeWebsiteUrl(url: string) {
  if (url.startsWith('/')) {
    return `${WEBSITE_ORIGIN}${url}`;
  }

  return url;
}

function isExternalUrl(url: string) {
  if (url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('sms:')) {
    return true;
  }

  if (
    url === 'about:blank' ||
    url.startsWith('about:') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('javascript:')
  ) {
    return false;
  }

  try {
    const nextUrl = new URL(normalizeWebsiteUrl(url), WEBSITE_URL);
    return nextUrl.host !== WEBSITE_HOST;
  } catch {
    return false;
  }
}

export default function App() {
  if (Platform.OS === 'web') {
    return <WebPreview />;
  }

  return <NativeWebViewApp />;
}

function NativeWebViewApp() {
  const webViewRef = useRef<WebViewType>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const clearLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  const startLoadingTimeout = useCallback(() => {
    clearLoadingTimeout();
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      loadingTimeoutRef.current = null;
    }, 12000);
  }, [clearLoadingTimeout]);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [canGoBack]);

  useEffect(() => clearLoadingTimeout, [clearLoadingTimeout]);

  const handleNavigationStateChange = useCallback(
    (event: WebViewNavigation) => {
      setCanGoBack(event.canGoBack);

      if (!event.loading) {
        clearLoadingTimeout();
        setIsLoading(false);
      }
    },
    [clearLoadingTimeout],
  );

  const handleShouldStartLoad = useCallback((request: { url: string }) => {
    const nextUrl = normalizeWebsiteUrl(request.url);

    if (isExternalUrl(nextUrl)) {
      Linking.openURL(nextUrl).catch((error) => {
        console.warn('Failed to open external URL', nextUrl, error);
      });
      return false;
    }

    return true;
  }, []);

  const handleRetry = () => {
    clearLoadingTimeout();
    setHasError(false);
    setIsLoading(true);
    startLoadingTimeout();
    setReloadKey((key) => key + 1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <WebView
          key={reloadKey}
          ref={webViewRef}
          source={{ uri: WEBSITE_URL }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          startInLoadingState
          pullToRefreshEnabled
          allowsBackForwardNavigationGestures
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          injectedJavaScriptBeforeContentLoaded={MOBILE_OPTIMIZATION_SCRIPT}
          injectedJavaScript={MOBILE_OPTIMIZATION_SCRIPT}
          onLoadStart={() => {
            setIsLoading(true);
            setHasError(false);
            startLoadingTimeout();
          }}
          onLoadEnd={() => {
            clearLoadingTimeout();
            setIsLoading(false);
          }}
          onError={(event) => {
            console.warn('Website failed to load', event.nativeEvent);
            clearLoadingTimeout();
            setHasError(true);
            setIsLoading(false);
          }}
          onHttpError={(event) => {
            console.warn('Website returned an HTTP error', event.nativeEvent);
          }}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
        />

        {isLoading && !hasError ? (
          <View pointerEvents="none" style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ff9f1c" />
          </View>
        ) : null}

        {hasError ? (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorTitle}>Unable to load EduHub</Text>
            <Text style={styles.errorText}>Check your internet connection and try again.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function WebPreview() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return (
    <View style={styles.safeArea}>
      {React.createElement('iframe', {
        key: reloadKey,
        src: WEBSITE_URL,
        title: 'EduHub',
        onLoad: () => setIsLoading(false),
        onError: () => {
          setHasError(true);
          setIsLoading(false);
        },
        style: styles.webFrame,
      })}

      {isLoading && !hasError ? (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff9f1c" />
        </View>
      ) : null}

      {hasError ? (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorTitle}>Unable to load EduHub</Text>
          <Text style={styles.errorText}>Check your internet connection and try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  errorTitle: {
    color: '#0a4a44',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  errorText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 48,
    minWidth: 128,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9f1c',
    borderRadius: 8,
    marginTop: 22,
    paddingHorizontal: 18,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
});
