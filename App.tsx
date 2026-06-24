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

      body[data-eduhub-route="resources"] header > div {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: nowrap !important;
        gap: 8px !important;
      }

      body[data-eduhub-route="resources"] header nav,
      body[data-eduhub-route="resources"] header > div > div:last-child,
      body[data-eduhub-route="resources"] header > div > button:last-child {
        margin-left: auto !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex-wrap: nowrap !important;
        gap: 8px !important;
        width: auto !important;
        max-width: max-content !important;
      }

      body[data-eduhub-route="resources"] header button {
        flex: 0 0 auto !important;
      }

      body[data-eduhub-route="resources"] header {
        position: relative !important;
      }

      body[data-eduhub-route="resources"] .eduhub-resource-header-login,
      body[data-eduhub-route="resources"] .eduhub-resource-header-menu {
        position: absolute !important;
        top: 18px !important;
        z-index: 2147482000 !important;
        flex: 0 0 auto !important;
      }

      body[data-eduhub-route="resources"] .eduhub-resource-header-login {
        right: 66px !important;
      }

      body[data-eduhub-route="resources"] .eduhub-resource-header-menu {
        right: 14px !important;
      }

      body[data-eduhub-route="resources"] nav {
        position: sticky !important;
        top: 0 !important;
        z-index: 2147482500 !important;
        min-height: 76px !important;
        padding-top: 10px !important;
        padding-bottom: 10px !important;
      }

      body[data-eduhub-route="resources"] .eduhub-public-nav-inner {
        position: relative !important;
        min-height: 54px !important;
        align-items: center !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      body[data-eduhub-route="resources"] .eduhub-public-nav-brand {
        align-self: center !important;
        padding-right: 126px !important;
      }

      body[data-eduhub-route="resources"] .eduhub-public-nav-actions {
        position: absolute !important;
        right: 0 !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        z-index: 2147482600 !important;
        margin-left: 0 !important;
      }

      body[data-eduhub-route="resources"] .eduhub-public-menu-button {
        margin-left: 8px !important;
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
        display: grid !important;
        grid-template-columns: 1fr !important;
        overflow: visible !important;
        gap: 10px !important;
        padding-bottom: 0 !important;
        scrollbar-width: auto !important;
      }

      body[data-eduhub-route="resources"] .grid:has(button):has(> :nth-child(3))::-webkit-scrollbar,
      body[data-eduhub-route="resources"] .flex:has(button):has(> :nth-child(3))::-webkit-scrollbar {
        display: none !important;
      }

      body[data-eduhub-route="resources"] .grid:has(button):has(> :nth-child(3)) > *,
      body[data-eduhub-route="resources"] .flex:has(button):has(> :nth-child(3)) > * {
        flex: 1 1 auto !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }

      body[data-eduhub-route="resources"] .mobile-carousel,
      body[data-eduhub-route="resources"] .mobile-scroll-track {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        overflow: visible !important;
        scroll-snap-type: none !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      body[data-eduhub-route="resources"] .mobile-carousel::after {
        display: none !important;
      }

      body[data-eduhub-route="resources"] .mobile-carousel > *,
      body[data-eduhub-route="resources"] .mobile-scroll-track > * {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        flex: 1 1 auto !important;
        scroll-snap-align: none !important;
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

      [data-eduhub-home-hidden="true"],
      [data-eduhub-footer-hidden="true"],
      [data-eduhub-menu-hidden="true"],
      [data-eduhub-live-backend-hidden="true"],
      [data-eduhub-foundation-hidden="true"],
      [data-eduhub-dashboard-kicker-hidden="true"] {
        display: none !important;
      }

      header p[class*="uppercase"][class*="tracking-"][class*="text-gray-400"] {
        display: none !important;
      }

      header button[aria-label="Toggle sidebar"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 44px !important;
        width: 44px !important;
        height: 44px !important;
        flex: 0 0 44px !important;
      }

      header button[aria-label="Toggle sidebar"] svg {
        width: 20px !important;
        height: 20px !important;
      }

      .eduhub-public-nav-inner {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px !important;
        flex-wrap: nowrap !important;
        width: 100% !important;
      }

      .eduhub-public-nav-brand,
      .eduhub-public-nav-actions {
        padding-left: 0 !important;
        padding-right: 0 !important;
        min-width: 0 !important;
        max-width: none !important;
      }

      .eduhub-public-nav-brand {
        width: auto !important;
        flex: 0 1 auto !important;
      }

      .eduhub-public-nav-actions {
        width: auto !important;
        flex: 0 0 auto !important;
        margin-left: auto !important;
        justify-content: flex-end !important;
      }

      .eduhub-public-menu-button {
        margin-left: 8px !important;
        min-width: 44px !important;
        width: 44px !important;
        flex: 0 0 44px !important;
        order: 999 !important;
      }

      .eduhub-dashboard-header {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
      }

      .eduhub-dashboard-header-left,
      .eduhub-dashboard-header-actions {
        padding-left: 0 !important;
        padding-right: 0 !important;
        min-width: 0 !important;
        max-width: none !important;
      }

      .eduhub-dashboard-header-left {
        width: auto !important;
        flex: 1 1 auto !important;
      }

      .eduhub-dashboard-header-actions {
        width: auto !important;
        flex: 0 0 auto !important;
        margin-left: auto !important;
      }

      .eduhub-dashboard-menu-button,
      .eduhub-dashboard-back-button {
        position: relative !important;
        z-index: 2147482600 !important;
        flex: 0 0 auto !important;
      }

      .eduhub-dashboard-menu-button {
        min-width: 44px !important;
        width: 44px !important;
      }

      .eduhub-resource-actions {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 12px !important;
        overflow: visible !important;
        width: 100% !important;
        padding-bottom: 0 !important;
        scroll-snap-type: none !important;
      }

      .eduhub-resource-actions > * {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        flex: 1 1 auto !important;
        scroll-snap-align: none !important;
      }

      .eduhub-resource-action {
        min-height: 56px !important;
        border-radius: 16px !important;
        padding: 12px 8px !important;
        font-size: 14px !important;
        line-height: 1 !important;
        white-space: nowrap !important;
      }

      .eduhub-resource-action svg {
        width: 18px !important;
        height: 18px !important;
        flex: 0 0 18px !important;
      }

      header {
        position: sticky !important;
        top: 0 !important;
        z-index: 2147482500 !important;
        overflow: visible !important;
        background: rgba(255, 255, 255, 0.96) !important;
        backdrop-filter: blur(18px) !important;
        min-height: 72px !important;
      }

      header > div {
        position: relative !important;
        z-index: 2147482501 !important;
        min-height: 64px !important;
        align-items: center !important;
      }

      header button[aria-label="Toggle sidebar"],
      header [data-eduhub-dashboard-back="true"] {
        position: relative !important;
        z-index: 2147482600 !important;
        pointer-events: auto !important;
      }

      header [data-eduhub-dashboard-back="true"] {
        flex: 0 0 auto !important;
        min-width: 48px !important;
        width: auto !important;
        background: #ffffff !important;
      }

      header + *,
      main > div:first-child {
        position: relative !important;
        z-index: 1 !important;
      }

      header a[href="/about"],
      header a[href*="/about"],
      header a[href="/services"],
      header a[href*="/services"],
      nav a[href="/about"],
      nav a[href*="/about"],
      nav a[href="/services"],
      nav a[href*="/services"],
      [role="dialog"] a[href="/about"],
      [role="dialog"] a[href*="/about"],
      [role="dialog"] a[href="/services"],
      [role="dialog"] a[href*="/services"] {
        display: none !important;
      }

      body[data-eduhub-route="profile"] main,
      body[data-eduhub-route="profile"] footer {
        display: none !important;
      }

      .eduhub-teacher-dashboard,
      .eduhub-profile-screen {
        display: grid !important;
        gap: 14px !important;
        min-height: calc(100vh - 82px) !important;
        padding: 16px 14px calc(96px + env(safe-area-inset-bottom, 0px)) !important;
        background: #f8fafc !important;
      }

      .eduhub-teacher-hero,
      .eduhub-teacher-card,
      .eduhub-profile-hero,
      .eduhub-profile-card {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 22px !important;
      }

      .eduhub-teacher-hero,
      .eduhub-profile-hero {
        display: grid !important;
        gap: 18px !important;
        padding: 18px !important;
        background: #0a4a44 !important;
        color: #ffffff !important;
        box-shadow: 0 16px 34px rgba(6, 24, 38, 0.16) !important;
      }

      .eduhub-teacher-top,
      .eduhub-teacher-stats,
      .eduhub-teacher-actions,
      .eduhub-teacher-action,
      .eduhub-teacher-row,
      .eduhub-profile-top,
      .eduhub-profile-identity,
      .eduhub-profile-chips,
      .eduhub-profile-row,
      .eduhub-profile-action {
        display: flex !important;
        align-items: center !important;
      }

      .eduhub-teacher-top,
      .eduhub-profile-top {
        justify-content: space-between !important;
        gap: 12px !important;
      }

      .eduhub-teacher-kicker,
      .eduhub-profile-kicker {
        margin: 0 !important;
        color: #ff9f1c !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: 0.12em !important;
        text-transform: uppercase !important;
      }

      .eduhub-teacher-title,
      .eduhub-profile-title {
        margin: 5px 0 0 !important;
        color: #ffffff !important;
        font-size: 24px !important;
        line-height: 1.08 !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-subtitle {
        margin: 8px 0 0 !important;
        color: rgba(204, 251, 241, 0.76) !important;
        font-size: 13px !important;
        line-height: 1.42 !important;
        font-weight: 700 !important;
      }

      .eduhub-teacher-stats,
      .eduhub-teacher-actions {
        gap: 8px !important;
      }

      .eduhub-teacher-stat {
        flex: 1 1 0 !important;
        display: grid !important;
        gap: 4px !important;
        min-height: 82px !important;
        padding: 12px !important;
        border-radius: 18px !important;
        border: 1px solid #e5e7eb !important;
        background: #ffffff !important;
        box-shadow: 0 12px 28px rgba(6, 24, 38, 0.08) !important;
      }

      .eduhub-teacher-stat strong {
        color: #0a4a44 !important;
        font-size: 22px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-stat span {
        color: #6b7280 !important;
        font-size: 11px !important;
        font-weight: 800 !important;
      }

      .eduhub-teacher-action {
        flex: 1 1 0 !important;
        justify-content: center !important;
        min-height: 48px !important;
        border: 0 !important;
        border-radius: 14px !important;
        background: #ff9f1c !important;
        color: #ffffff !important;
        font-size: 13px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-action[data-variant="secondary"] {
        background: #ffffff !important;
        color: #0a4a44 !important;
      }

      .eduhub-teacher-card {
        display: grid !important;
        gap: 10px !important;
        padding: 16px !important;
        border: 1px solid #e5e7eb !important;
        background: #ffffff !important;
        box-shadow: 0 12px 28px rgba(6, 24, 38, 0.08) !important;
      }

      .eduhub-teacher-card h2 {
        margin: 0 !important;
        color: #0a4a44 !important;
        font-size: 17px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-row {
        gap: 12px !important;
        min-height: 58px !important;
        padding: 10px 12px !important;
        border-radius: 16px !important;
        background: #f3f4f6 !important;
      }

      .eduhub-teacher-icon {
        width: 38px !important;
        height: 38px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 38px !important;
        border-radius: 13px !important;
        background: #ffffff !important;
      }

      .eduhub-teacher-row strong {
        display: block !important;
        color: #061826 !important;
        font-size: 14px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-row span {
        display: block !important;
        margin-top: 3px !important;
        color: #6b7280 !important;
        font-size: 12px !important;
        font-weight: 700 !important;
      }

      .eduhub-teacher-hero-chips {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
      }

      .eduhub-teacher-hero-chips span {
        display: inline-flex !important;
        align-items: center !important;
        min-height: 32px !important;
        border-radius: 18px !important;
        background: rgba(255, 255, 255, 0.08) !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        padding: 8px 12px !important;
      }

      .eduhub-teacher-search {
        min-height: 54px !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        border-radius: 18px !important;
        border: 1px solid #e5e7eb !important;
        background: #ffffff !important;
        padding: 0 16px !important;
      }

      .eduhub-teacher-search span {
        color: #94a3b8 !important;
        font-size: 12px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-search input {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        border: 0 !important;
        outline: 0 !important;
        background: transparent !important;
        color: #0a4a44 !important;
        font-size: 15px !important;
        font-weight: 800 !important;
      }

      .eduhub-teacher-section-title,
      .eduhub-teacher-section-header h2 {
        margin: 0 !important;
        color: #0a4a44 !important;
        font-size: 18px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-section-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;
        margin-top: 2px !important;
      }

      .eduhub-teacher-section-header button {
        border: 0 !important;
        background: transparent !important;
        color: #e68a00 !important;
        font-size: 14px !important;
        font-weight: 700 !important;
      }

      .eduhub-teacher-quick-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 12px !important;
      }

      .eduhub-teacher-quick-action {
        min-height: 108px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 22px !important;
        background: #ffffff !important;
        color: #0a4a44 !important;
        padding: 16px !important;
        box-shadow: 0 12px 28px rgba(6, 24, 38, 0.08) !important;
      }

      .eduhub-teacher-quick-icon {
        width: 48px !important;
        height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 16px !important;
        background: #fff7ed !important;
        color: #ff9f1c !important;
        font-size: 20px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-quick-label {
        color: #0a4a44 !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        text-align: center !important;
      }

      .eduhub-teacher-list {
        display: grid !important;
        gap: 12px !important;
      }

      .eduhub-teacher-material-card {
        display: grid !important;
        gap: 12px !important;
        padding: 18px !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 24px !important;
        background: #ffffff !important;
        box-shadow: 0 12px 28px rgba(6, 24, 38, 0.08) !important;
      }

      .eduhub-teacher-material-header,
      .eduhub-teacher-material-info,
      .eduhub-teacher-material-actions {
        display: flex !important;
        align-items: center !important;
      }

      .eduhub-teacher-material-header {
        justify-content: space-between !important;
        gap: 10px !important;
        border-bottom: 1px solid #f3f4f6 !important;
        padding-bottom: 12px !important;
      }

      .eduhub-teacher-material-header h3 {
        min-width: 0 !important;
        margin: 0 !important;
        color: #0a4a44 !important;
        font-size: 17px !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;
      }

      .eduhub-teacher-downloads {
        flex: 0 0 auto !important;
        border-radius: 12px !important;
        background: #fff7ed !important;
        color: #e68a00 !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        padding: 4px 8px !important;
      }

      .eduhub-teacher-material-info {
        flex-wrap: wrap !important;
        gap: 10px 16px !important;
      }

      .eduhub-teacher-material-info span {
        color: #6b7280 !important;
        font-size: 13px !important;
        font-weight: 700 !important;
      }

      .eduhub-teacher-material-actions {
        justify-content: flex-end !important;
        gap: 8px !important;
        border-top: 1px solid #f8fafc !important;
        padding-top: 12px !important;
      }

      .eduhub-teacher-icon-action {
        width: 42px !important;
        height: 42px !important;
        min-height: 42px !important;
        border: 0 !important;
        border-radius: 14px !important;
        background: #fff7ed !important;
        color: #ff9f1c !important;
        font-size: 13px !important;
        font-weight: 900 !important;
      }

      .eduhub-teacher-icon-action.danger {
        background: #fef2f2 !important;
        color: #dc2626 !important;
      }

      .eduhub-profile-edit {
        width: 42px !important;
        height: 42px !important;
        min-height: 42px !important;
        border: 0 !important;
        border-radius: 14px !important;
        background: #ffffff !important;
        color: #0a4a44 !important;
        font-size: 18px !important;
        font-weight: 900 !important;
      }

      .eduhub-profile-identity {
        gap: 14px !important;
      }

      .eduhub-profile-avatar {
        width: 76px !important;
        height: 76px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 76px !important;
        border-radius: 24px !important;
        border: 3px solid rgba(255, 255, 255, 0.22) !important;
        background: #ff9f1c !important;
        color: #ffffff !important;
        font-size: 28px !important;
        font-weight: 900 !important;
      }

      .eduhub-profile-name {
        margin: 0 !important;
        color: #ffffff !important;
        font-size: 20px !important;
        font-weight: 900 !important;
        line-height: 1.16 !important;
      }

      .eduhub-profile-email {
        margin: 4px 0 0 !important;
        color: rgba(255, 255, 255, 0.76) !important;
        font-size: 13px !important;
        font-weight: 700 !important;
      }

      .eduhub-profile-chips {
        flex-wrap: wrap !important;
        gap: 8px !important;
      }

      .eduhub-profile-chip,
      .eduhub-profile-status {
        min-height: 32px !important;
        border-radius: 999px !important;
        padding: 8px 12px !important;
        font-size: 12px !important;
        font-weight: 900 !important;
      }

      .eduhub-profile-chip {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.16) !important;
      }

      .eduhub-profile-status {
        background: #ffffff !important;
        color: #0a4a44 !important;
      }

      .eduhub-profile-card {
        display: grid !important;
        gap: 10px !important;
        padding: 16px !important;
        border: 1px solid #e5e7eb !important;
        background: #ffffff !important;
        box-shadow: 0 12px 28px rgba(6, 24, 38, 0.08) !important;
      }

      .eduhub-profile-card h2 {
        margin: 0 0 2px !important;
        color: #0a4a44 !important;
        font-size: 17px !important;
        font-weight: 900 !important;
      }

      .eduhub-profile-row,
      .eduhub-profile-action {
        min-height: 58px !important;
        gap: 12px !important;
        padding: 10px 12px !important;
        border-radius: 16px !important;
        background: #f3f4f6 !important;
      }

      .eduhub-profile-row-icon,
      .eduhub-profile-action-icon {
        width: 38px !important;
        height: 38px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 38px !important;
        border-radius: 13px !important;
        background: #ffffff !important;
      }

      .eduhub-profile-label {
        margin: 0 !important;
        color: #6b7280 !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
      }

      .eduhub-profile-value,
      .eduhub-profile-action-title {
        margin: 3px 0 0 !important;
        color: #061826 !important;
        font-size: 15px !important;
        font-weight: 900 !important;
      }

      .eduhub-profile-action {
        width: 100% !important;
        border: 0 !important;
        text-align: left !important;
      }

      .eduhub-profile-action-subtitle {
        margin: 3px 0 0 !important;
        color: #6b7280 !important;
        font-size: 12px !important;
        font-weight: 700 !important;
      }

      .eduhub-profile-danger .eduhub-profile-action-title,
      .eduhub-profile-danger .eduhub-profile-action-icon {
        color: #dc2626 !important;
      }

      body[data-eduhub-route="home"] main > section {
        padding-top: 18px !important;
        padding-bottom: 18px !important;
      }

      body[data-eduhub-route="home"] main > section:first-of-type {
        padding-top: 14px !important;
        padding-bottom: 16px !important;
      }

      body[data-eduhub-route="home"] main > section:first-of-type h1 {
        font-size: clamp(28px, 8vw, 38px) !important;
        line-height: 1.04 !important;
      }

      body[data-eduhub-route="home"] main > section:first-of-type p {
        font-size: 13px !important;
        line-height: 1.42 !important;
      }

      body[data-eduhub-route="home"] main > section:first-of-type .grid:has(> :nth-child(3)) > * {
        flex-basis: min(74vw, 260px) !important;
        min-width: min(74vw, 260px) !important;
      }

      footer {
        padding-top: 8px !important;
        padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
        background: #0a4a44 !important;
        border-top: 1px solid rgba(255, 159, 28, 0.28) !important;
        color: #ffffff !important;
      }

      footer > div {
        display: grid !important;
        gap: 5px !important;
      }

      footer h2,
      footer h3,
      footer h4 {
        color: #ffffff !important;
        font-size: 12px !important;
        line-height: 1.08 !important;
        margin-bottom: 2px !important;
      }

      footer p,
      footer a,
      footer li,
      footer span {
        color: rgba(255, 255, 255, 0.78) !important;
        font-size: 10px !important;
        line-height: 1.18 !important;
      }

      footer a {
        color: #ff9f1c !important;
        font-weight: 800 !important;
      }

      footer [class*="py-"],
      footer [class*="pt-"],
      footer [class*="pb-"],
      footer [class*="p-"] {
        padding-top: 3px !important;
        padding-bottom: 3px !important;
      }

      footer [class*="gap-"] {
        gap: 4px !important;
      }

      body {
        padding-bottom: calc(86px + env(safe-area-inset-bottom, 0px)) !important;
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
        min-height: calc(74px + env(safe-area-inset-bottom, 0px)) !important;
        padding: 8px 10px calc(10px + env(safe-area-inset-bottom, 0px)) !important;
        border: 0 !important;
        border-top: 1px solid rgba(10, 74, 68, 0.10) !important;
        border-radius: 0 !important;
        background: #ffffff !important;
        box-shadow: 0 -8px 24px rgba(10, 74, 68, 0.12) !important;
        backdrop-filter: blur(18px) !important;
        -webkit-backdrop-filter: blur(18px) !important;
      }

      .eduhub-native-bottom-nav button {
        min-height: 50px !important;
        border: 0 !important;
        border-radius: 13px !important;
        background: transparent !important;
        color: #64748b !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        padding: 6px 2px !important;
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
    var isTeacherPath = path === '/teacher' || path.indexOf('/teacher/') === 0 || path.indexOf('teacher') >= 0;
    var route = path === '/' || path === '/home' ? 'home' : path === '/notes' || path === '/papers' ? 'resources' : path === '/profile' ? 'profile' : isTeacherPath ? 'teacher' : 'default';

    if (document.body) {
      document.body.setAttribute('data-eduhub-route', route);
      document.body.setAttribute('data-eduhub-path', path || '/');
      if (!isTeacherPath) {
        document.body.removeAttribute('data-eduhub-teacher-dashboard-ready');
      }
    }
  }

  function compactHomeAndFooter() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-eduhub-home-hidden], [data-eduhub-footer-hidden]'), function (element) {
      element.removeAttribute('data-eduhub-home-hidden');
      element.removeAttribute('data-eduhub-footer-hidden');
    });

    var path = window.location.pathname || '/';
    var isHome = path === '/' || path === '/home';

    if (isHome) {
      var sections = document.querySelectorAll('main > section');
      Array.prototype.forEach.call(sections, function (section, index) {
        if (index >= 3) section.setAttribute('data-eduhub-home-hidden', 'true');
      });

      var heroGrids = sections[0] ? sections[0].querySelectorAll('.grid') : [];
      Array.prototype.forEach.call(heroGrids, function (grid) {
        Array.prototype.forEach.call(grid.children, function (card, index) {
          if (index >= 3) card.setAttribute('data-eduhub-home-hidden', 'true');
        });
      });
    }

    var footer = document.querySelector('footer');
    if (!footer) return;

    Array.prototype.forEach.call(footer.querySelectorAll('p'), function (paragraph, index) {
      if (index > 0) paragraph.setAttribute('data-eduhub-footer-hidden', 'true');
    });

    Array.prototype.forEach.call(footer.querySelectorAll('li'), function (item, index) {
      if (index >= 3) item.setAttribute('data-eduhub-footer-hidden', 'true');
    });

    Array.prototype.forEach.call(footer.querySelectorAll('a, button'), function (item, index) {
      if (index >= 4) item.setAttribute('data-eduhub-footer-hidden', 'true');
    });
  }

  function removeAboutServicesFromMenu() {
    var items = document.querySelectorAll('header a, header button, nav a, nav button, [role="dialog"] a, [role="dialog"] button');

    Array.prototype.forEach.call(items, function (item) {
      var label = String(item.textContent || item.getAttribute('aria-label') || item.getAttribute('title') || '')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();
      var href = item.getAttribute && item.getAttribute('href') ? item.getAttribute('href') : '';
      var path = '';

      try {
        path = href ? new URL(href, window.location.origin).pathname.toLowerCase() : '';
      } catch (error) {}

      var isStudentLogin =
        label === 'student login' ||
        label === 'student signin' ||
        label === 'student sign in' ||
        label === 'student log in';
      var isAbout = label === 'about' || label.indexOf('about us') >= 0 || path === '/about';
      var isServices = label === 'services' || label.indexOf('our services') >= 0 || path === '/services';

      if (isStudentLogin) {
        item.textContent = 'Login';
        item.setAttribute('aria-label', 'Login');
      }

      if (isAbout || isServices) {
        item.setAttribute('data-eduhub-menu-hidden', 'true');
      }
    });
  }

  function alignResourceHeaderActions() {
    Array.prototype.forEach.call(document.querySelectorAll('.eduhub-resource-header-login, .eduhub-resource-header-menu'), function (element) {
      element.classList.remove('eduhub-resource-header-login');
      element.classList.remove('eduhub-resource-header-menu');
      element.removeAttribute('data-eduhub-resource-action');
      element.style.position = '';
      element.style.top = '';
      element.style.right = '';
      element.style.zIndex = '';
    });

    var path = window.location.pathname || '/';
    if (path !== '/notes' && path !== '/papers') return;

    var header = document.querySelector('header');
    if (!header) return;

    header.style.position = 'relative';

    var controls = Array.prototype.slice.call(header.querySelectorAll('a, button'));
    var buttons = Array.prototype.slice.call(header.querySelectorAll('button'));
    var loginControl = null;
    var menuControl = null;

    controls.forEach(function (control) {
      var label = String(control.textContent || control.getAttribute('aria-label') || control.getAttribute('title') || '')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();
      var hasMenuIcon = !!control.querySelector('svg') && label.length <= 12;

      if (!loginControl && (label === 'login' || label === 'sign in' || label === 'signin' || label === 'log in')) {
        loginControl = control;
      }
    });

    buttons.forEach(function (button) {
      var label = String(button.textContent || button.getAttribute('aria-label') || button.getAttribute('title') || '')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();
      var isLogin = button === loginControl || label === 'login' || label.indexOf('login') >= 0 || label.indexOf('sign in') >= 0;
      var isBrand = label.indexOf('educ') >= 0 || label.indexOf('logo') >= 0 || label.indexOf('school') >= 0;
      var isMenu = label.indexOf('menu') >= 0 || label === '☰' || (!!button.querySelector('svg') && !isLogin && !isBrand);

      if (isMenu) {
        menuControl = button;
      }
    });

    if (!menuControl) {
      var nonLoginButtons = buttons.filter(function (button) {
        return button !== loginControl;
      });
      menuControl = nonLoginButtons[nonLoginButtons.length - 1] || null;
    }

    if (loginControl) {
      loginControl.textContent = 'Login';
      loginControl.classList.add('eduhub-resource-header-login');
      loginControl.setAttribute('data-eduhub-resource-action', 'login');
      loginControl.style.position = 'absolute';
      loginControl.style.top = '18px';
      loginControl.style.right = '66px';
      loginControl.style.zIndex = '2147482000';
    }

    if (menuControl && menuControl !== loginControl) {
      menuControl.classList.add('eduhub-resource-header-menu');
      menuControl.setAttribute('data-eduhub-resource-action', 'menu');
      menuControl.style.position = 'absolute';
      menuControl.style.top = '18px';
      menuControl.style.right = '14px';
      menuControl.style.zIndex = '2147482000';
    }
  }

  function removeLiveBackendLabel() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-eduhub-live-backend-hidden]'), function (element) {
      element.removeAttribute('data-eduhub-live-backend-hidden');
    });

    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (element) {
      if (element.children && element.children.length > 0) return;

      var label = String(element.textContent || '')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (label === 'live from backend') {
        element.setAttribute('data-eduhub-live-backend-hidden', 'true');
      }
    });
  }

  function normalizeDashboardHeaderChrome() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-eduhub-dashboard-kicker-hidden]'), function (element) {
      element.removeAttribute('data-eduhub-dashboard-kicker-hidden');
    });

    Array.prototype.forEach.call(document.querySelectorAll('header p, header span, body *'), function (element) {
      if (element.children && element.children.length > 0) return;

      var label = String(element.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      var compactLabel = label.replace(/[^a-z0-9]/g, '');
      var className = String(element.getAttribute('class') || '');
      var looksLikeDashboardKicker =
        className.indexOf('uppercase') >= 0 &&
        className.indexOf('tracking-') >= 0 &&
        className.indexOf('text-gray-400') >= 0;

      if (
        label === 'student workspace' ||
        label === 'teacher workspace' ||
        label === 'workspace' ||
        compactLabel === 'workspace' ||
        compactLabel === 'studentworkspace' ||
        compactLabel === 'teacherworkspace' ||
        looksLikeDashboardKicker
      ) {
        element.setAttribute('data-eduhub-dashboard-kicker-hidden', 'true');
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('header button'), function (button) {
      var label = String(button.textContent || button.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (label === 'back' || label === 'go back') {
        button.setAttribute('data-eduhub-dashboard-back', 'true');
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('header button[aria-label="Toggle sidebar"]'), function (button) {
      if (button.querySelector('svg')) return;

      var label = String(button.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (label === 'menu' || label === '?' || label === '☰' || label.length <= 3) {
        button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>';
      }
    });
  }
  function removeResourceFoundation() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-eduhub-foundation-hidden]'), function (element) {
      element.removeAttribute('data-eduhub-foundation-hidden');
    });

    var path = window.location.pathname || '/';
    if (path !== '/notes' && path !== '/papers') return;

    Array.prototype.forEach.call(document.querySelectorAll('[class*="absolute"][class*="bottom-0"][class*="h-1"]'), function (element) {
      element.setAttribute('data-eduhub-foundation-hidden', 'true');
    });
  }

  function readStoredUser() {
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
          var user = parsed && (parsed.user || parsed);
          if (user && (user.name || user.email || user.role)) return user;
        } catch (error) {}
      }
    }

    return {};
  }

  function formatProfileRole(value) {
    var role = String(value || 'student').toLowerCase();
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  function getInitials(name) {
    var parts = String(name || 'EduHub User').trim().split(/\\s+/).filter(Boolean);
    return parts.slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join('') || 'U';
  }

  function createProfileElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function createProfileRow(icon, label, value) {
    var row = createProfileElement('div', 'eduhub-profile-row');
    row.appendChild(createProfileElement('div', 'eduhub-profile-row-icon', icon));

    var copy = createProfileElement('div', '');
    copy.appendChild(createProfileElement('p', 'eduhub-profile-label', label));
    copy.appendChild(createProfileElement('p', 'eduhub-profile-value', value || 'Not available'));
    row.appendChild(copy);
    return row;
  }

  function createProfileAction(icon, title, subtitle, isDanger, onPress) {
    var action = createProfileElement('button', 'eduhub-profile-action' + (isDanger ? ' eduhub-profile-danger' : ''));
    action.type = 'button';
    action.appendChild(createProfileElement('div', 'eduhub-profile-action-icon', icon));

    var copy = createProfileElement('div', '');
    copy.appendChild(createProfileElement('p', 'eduhub-profile-action-title', title));
    copy.appendChild(createProfileElement('p', 'eduhub-profile-action-subtitle', subtitle));
    action.appendChild(copy);
    action.addEventListener('click', onPress);
    return action;
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

  function installProfileScreen() {
    var path = window.location.pathname || '/';
    var existing = document.getElementById('eduhub-profile-screen');

    if (path !== '/profile') {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return;
    }

    if (existing) return;

    var user = readStoredUser();
    var name = user.name || 'EduHub User';
    var email = user.email || 'No email added';
    var role = formatProfileRole(user.role);

    var screen = createProfileElement('section', 'eduhub-profile-screen');
    screen.id = 'eduhub-profile-screen';

    var hero = createProfileElement('div', 'eduhub-profile-hero');
    var top = createProfileElement('div', 'eduhub-profile-top');
    var titleWrap = createProfileElement('div', '');
    titleWrap.appendChild(createProfileElement('p', 'eduhub-profile-kicker', 'Profile'));
    titleWrap.appendChild(createProfileElement('h1', 'eduhub-profile-title', 'Your EduHub account'));
    top.appendChild(titleWrap);

    var edit = createProfileElement('button', 'eduhub-profile-edit', '✎');
    edit.type = 'button';
    edit.addEventListener('click', function () {
      window.alert('Profile editing is available from the dashboard account settings.');
    });
    top.appendChild(edit);
    hero.appendChild(top);

    var identity = createProfileElement('div', 'eduhub-profile-identity');
    identity.appendChild(createProfileElement('div', 'eduhub-profile-avatar', getInitials(name)));
    var identityCopy = createProfileElement('div', '');
    identityCopy.appendChild(createProfileElement('h2', 'eduhub-profile-name', name));
    identityCopy.appendChild(createProfileElement('p', 'eduhub-profile-email', email));
    identity.appendChild(identityCopy);
    hero.appendChild(identity);

    var chips = createProfileElement('div', 'eduhub-profile-chips');
    chips.appendChild(createProfileElement('span', 'eduhub-profile-chip', role));
    chips.appendChild(createProfileElement('span', 'eduhub-profile-status', 'Active'));
    hero.appendChild(chips);
    screen.appendChild(hero);

    var details = createProfileElement('div', 'eduhub-profile-card');
    details.appendChild(createProfileElement('h2', '', 'Personal Details'));
    details.appendChild(createProfileRow('👤', 'Name', name));
    details.appendChild(createProfileRow('✉', 'Email', email));
    details.appendChild(createProfileRow('🎓', 'Role', role));
    details.appendChild(createProfileRow('✓', 'Status', 'Active'));
    screen.appendChild(details);

    var account = createProfileElement('div', 'eduhub-profile-card');
    account.appendChild(createProfileElement('h2', '', 'Account'));
    account.appendChild(createProfileAction('🔒', 'Security', 'Password and account access', false, function () {
      window.alert('Security settings will be available soon.');
    }));
    account.appendChild(createProfileAction('🔔', 'Notifications', 'Updates about notes and papers', false, function () {
      window.alert('Notification preferences will be available soon.');
    }));
    account.appendChild(createProfileAction('↪', 'Sign Out', 'End this session on your device', true, logoutUser));
    screen.appendChild(account);

    var header = document.querySelector('header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(screen, header.nextSibling);
    } else {
      document.body.appendChild(screen);
    }
  }

  function normalizeTeacherMaterials(items) {
    if (!Array.isArray(items)) return [];
    return items.map(function (item) {
      var uploader = item.uploadedBy || item.uploaderId || item.author || {};
      return {
        id: item.id || item._id || '',
        title: item.title || 'Untitled resource',
        subject: typeof item.subject === 'string' ? item.subject : (item.subject && (item.subject.name || item.subject.code)) || 'General',
        course: typeof item.course === 'string' ? item.course : (item.course && (item.course.name || item.course.code)) || '',
        department: typeof item.department === 'string' ? item.department : (item.department && (item.department.name || item.department.code)) || '',
        fileUrl: item.fileUrl || item.file || item.url || '',
        downloads: item.downloadsCount || item.downloads || item.views || 0,
        createdAt: item.createdAt || '',
        uploadedById: uploader.id || uploader._id || '',
        uploadedBy: uploader.name || ''
      };
    });
  }

  function isTeacherOwnedMaterial(item, user) {
    var userId = user.id || user._id || '';
    var userName = (user.name || '').trim().toLowerCase();
    var uploaderName = (item.uploadedBy || '').trim().toLowerCase();

    return Boolean(
      (userId && item.uploadedById && item.uploadedById === userId) ||
      (userName && uploaderName && uploaderName === userName)
    );
  }

  function filterTeacherMaterials(items, user, query) {
    var search = (query || '').trim().toLowerCase();
    return items.filter(function (item) {
      var hasOwner = Boolean(item.uploadedById || item.uploadedBy);
      if (hasOwner && !isTeacherOwnedMaterial(item, user)) return false;
      if (!search) return true;
      return [item.title, item.subject, item.course, item.department].some(function (value) {
        return value && String(value).toLowerCase().indexOf(search) >= 0;
      });
    });
  }

  function sortTeacherMaterialsByNewest(items) {
    return items.slice().sort(function (left, right) {
      return new Date(right.item.createdAt || 0).getTime() - new Date(left.item.createdAt || 0).getTime();
    });
  }

  function createTeacherElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function createTeacherStat(value, label) {
    var stat = createTeacherElement('div', 'eduhub-teacher-stat');
    stat.appendChild(createTeacherElement('strong', '', String(value)));
    stat.appendChild(createTeacherElement('span', '', label));
    return stat;
  }

  function createTeacherRow(icon, title, meta) {
    var row = createTeacherElement('div', 'eduhub-teacher-row');
    row.appendChild(createTeacherElement('div', 'eduhub-teacher-icon', icon));
    var copy = createTeacherElement('div', '');
    copy.appendChild(createTeacherElement('strong', '', title));
    copy.appendChild(createTeacherElement('span', '', meta));
    row.appendChild(copy);
    return row;
  }

  function createTeacherQuickAction(icon, title, pathOrRefresh) {
    var action = createTeacherElement('button', 'eduhub-teacher-quick-action');
    action.type = 'button';
    var box = createTeacherElement('span', 'eduhub-teacher-quick-icon', icon);
    var label = createTeacherElement('span', 'eduhub-teacher-quick-label', title);
    action.appendChild(box);
    action.appendChild(label);
    action.addEventListener('click', function () {
      if (pathOrRefresh === 'refresh') {
        var screen = document.getElementById('eduhub-teacher-dashboard');
        if (screen) loadTeacherDashboardData(screen);
        return;
      }
      navigateTeacher(pathOrRefresh);
    });
    return action;
  }

  function createTeacherIconButton(label, icon, onClick, danger) {
    var button = createTeacherElement('button', danger ? 'eduhub-teacher-icon-action danger' : 'eduhub-teacher-icon-action');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.textContent = icon;
    button.addEventListener('click', onClick);
    return button;
  }

  function createTeacherMaterialCard(item, type) {
    var card = createTeacherElement('article', 'eduhub-teacher-material-card');
    var header = createTeacherElement('div', 'eduhub-teacher-material-header');
    header.appendChild(createTeacherElement('h3', '', item.title));
    var downloads = createTeacherElement('span', 'eduhub-teacher-downloads', String(item.downloads));
    header.appendChild(downloads);
    card.appendChild(header);

    var info = createTeacherElement('div', 'eduhub-teacher-material-info');
    info.appendChild(createTeacherElement('span', '', type === 'paper' ? 'Paper' : 'Note'));
    info.appendChild(createTeacherElement('span', '', item.subject));
    info.appendChild(createTeacherElement('span', '', item.course || item.department || 'General'));
    card.appendChild(info);

    var actions = createTeacherElement('div', 'eduhub-teacher-material-actions');
    actions.appendChild(createTeacherIconButton('Open', 'O', function () {
      if (item.fileUrl) {
        window.open(item.fileUrl, '_blank');
      } else {
        window.alert('This resource does not have a file link yet.');
      }
    }));
    actions.appendChild(createTeacherIconButton('Edit', 'E', function () {
      navigateTeacher('/teacher/upload?type=' + encodeURIComponent(type) + '&id=' + encodeURIComponent(item.id));
    }));
    actions.appendChild(createTeacherIconButton('Delete', 'D', function () {
      if (!window.confirm('Delete this ' + type + '?')) return;
      var endpoint = type === 'paper' ? '/api/papers/' : '/api/notes/';
      window.fetch(endpoint + encodeURIComponent(item.id), { method: 'DELETE', headers: { Authorization: 'Bearer ' + (window.localStorage ? window.localStorage.getItem('token') : '') } })
        .then(function () {
          var screen = document.getElementById('eduhub-teacher-dashboard');
          if (screen) loadTeacherDashboardData(screen);
        })
        .catch(function () {
          window.alert('Unable to delete this resource. Please try again.');
        });
    }, true));
    card.appendChild(actions);
    return card;
  }

  function navigateTeacher(path) {
    navigateInApp(path);
  }

  function renderTeacherDashboardData(screen, notes, papers, user, query) {
    var stats = screen.querySelector('[data-eduhub-teacher-stats]');
    var recent = screen.querySelector('[data-eduhub-teacher-recent]');
    var notesList = screen.querySelector('[data-eduhub-teacher-notes]');
    var papersList = screen.querySelector('[data-eduhub-teacher-papers]');
    if (!stats || !recent || !notesList || !papersList) return;

    var myNotes = filterTeacherMaterials(notes, user, query);
    var myPapers = filterTeacherMaterials(papers, user, query);
    var totalDownloads = myNotes.concat(myPapers).reduce(function (total, item) {
      return total + item.downloads;
    }, 0);

    stats.innerHTML = '';
    stats.appendChild(createTeacherStat(myNotes.length, 'My Notes'));
    stats.appendChild(createTeacherStat(myPapers.length, 'My Papers'));
    stats.appendChild(createTeacherStat(totalDownloads, 'Downloads'));

    var recentItems = sortTeacherMaterialsByNewest(
      myNotes.map(function (item) { return { type: 'note', item: item }; })
        .concat(myPapers.map(function (item) { return { type: 'paper', item: item }; }))
    ).slice(0, 3);

    recent.innerHTML = '';
    if (!recentItems.length) {
      recent.appendChild(createTeacherRow('+', 'No recent uploads', 'Upload notes or papers to see them here'));
    } else {
      recentItems.forEach(function (entry) {
        recent.appendChild(createTeacherMaterialCard(entry.item, entry.type));
      });
    }

    notesList.innerHTML = '';
    if (!myNotes.length) {
      notesList.appendChild(createTeacherRow('+', 'No notes found', 'Upload notes from this teacher account'));
    } else {
      myNotes.slice(0, 3).forEach(function (note) {
        notesList.appendChild(createTeacherMaterialCard(note, 'note'));
      });
    }

    papersList.innerHTML = '';
    if (!myPapers.length) {
      papersList.appendChild(createTeacherRow('+', 'No papers found', 'Upload papers from this teacher account'));
    } else {
      myPapers.slice(0, 3).forEach(function (paper) {
        papersList.appendChild(createTeacherMaterialCard(paper, 'paper'));
      });
    }
  }

  function loadTeacherDashboardData(screen) {
    var user = readStoredUser();
    var search = screen.querySelector('[data-eduhub-teacher-search]');
    var query = search ? search.value : '';

    var token = window.localStorage ? window.localStorage.getItem('token') : '';
    var authHeaders = token ? { Authorization: 'Bearer ' + token } : {};

    Promise.all([
      window.fetch('/api/users/me/resources?type=notes', { headers: authHeaders }).then(function (response) { return response.json(); }).catch(function () { return { items: [] }; }),
      window.fetch('/api/users/me/resources?type=papers', { headers: authHeaders }).then(function (response) { return response.json(); }).catch(function () { return { items: [] }; })
    ]).then(function (results) {
      renderTeacherDashboardData(screen, normalizeTeacherMaterials(results[0].items || results[0]), normalizeTeacherMaterials(results[1].items || results[1]), user, query);
    });
  }

  function installTeacherDashboardScreen() {
    var existing = document.getElementById('eduhub-teacher-dashboard');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    if (document.body) document.body.removeAttribute('data-eduhub-teacher-dashboard-ready');
  }

  function dispatchRouteUpdate() {
    try {
      window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    } catch (error) {
      window.dispatchEvent(new Event('popstate'));
    }
  }

  function navigateInApp(path) {
    history.pushState({}, document.title, path);
    dispatchRouteUpdate();
    window.setTimeout(handleRouteChange, 0);
  }

  function installBottomNav() {
    if (window.matchMedia && !window.matchMedia('(max-width: 640px)').matches) return;
    if (!document.body) return;

    var nav = document.getElementById('eduhub-native-bottom-nav');
    if (!nav) {
      nav = document.createElement('div');
      nav.id = 'eduhub-native-bottom-nav';
      nav.className = 'eduhub-native-bottom-nav';
      document.body.appendChild(nav);
    }

    var path = window.location.pathname || '/';
    var items = [
      { key: 'home', label: 'Home', path: '/home', icon: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z' },
      { key: 'notes', label: 'Notes', path: '/notes', icon: 'M5 4h14v16H5V4Zm4 4h6M9 12h6M9 16h4' },
      { key: 'papers', label: 'Paper', path: '/papers', icon: 'M7 3h8l4 4v14H7V3Zm8 0v5h5M9 13h8M9 17h8' },
      { key: 'profile', label: 'Profile', path: '/profile', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0' }
    ];

    nav.innerHTML = '';
    items.forEach(function (item) {
      var active =
        (item.key === 'home' && (path === '/' || path === '/home')) ||
        (item.key === 'notes' && path === '/notes') ||
        (item.key === 'papers' && path === '/papers') ||
        (item.key === 'profile' && (path === '/profile' || path === '/student' || path === '/teacher' || path === '/admin' || path === '/auth'));

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
        navigateInApp(item.path);
      });
      nav.appendChild(button);
    });
  }

  function handleRouteChange() {
    syncRouteClass();
    removeAboutServicesFromMenu();
    alignResourceHeaderActions();
    normalizeDashboardHeaderChrome();
    window.setTimeout(compactHomeAndFooter, 80);
    window.setTimeout(removeAboutServicesFromMenu, 80);
    window.setTimeout(alignResourceHeaderActions, 80);
    window.setTimeout(normalizeDashboardHeaderChrome, 80);
    window.setTimeout(removeLiveBackendLabel, 80);
    window.setTimeout(removeResourceFoundation, 80);
    window.setTimeout(installProfileScreen, 80);
    window.setTimeout(installTeacherDashboardScreen, 80);
    window.setTimeout(installBottomNav, 80);
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

  function installMenuObserver() {
    if (window.__eduhubMenuObserverInstalled || !document.body || !window.MutationObserver) return;

    var observer = new MutationObserver(function () {
      removeAboutServicesFromMenu();
      alignResourceHeaderActions();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.__eduhubMenuObserverInstalled = true;
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
    installMenuObserver();
    handleRouteChange();
    window.setInterval(installBottomNav, 1500);
    window.setInterval(removeAboutServicesFromMenu, 1500);
    window.setInterval(alignResourceHeaderActions, 1500);
    window.setInterval(normalizeDashboardHeaderChrome, 1500);
    window.setInterval(removeLiveBackendLabel, 1500);
    window.setInterval(removeResourceFoundation, 1500);
    window.setInterval(installProfileScreen, 1500);
    window.setInterval(installTeacherDashboardScreen, 1500);
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
  const lastLoadStartRef = useRef(0);
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
    }, 6000);
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
          onLoadStart={(event) => {
            const now = Date.now();
            const url = event.nativeEvent.url || '';
            const isWebsiteLoad =
              !url ||
              url === WEBSITE_URL ||
              url.startsWith(WEBSITE_ORIGIN) ||
              url.startsWith('about:') ||
              url.startsWith('data:');

            if (isWebsiteLoad && now - lastLoadStartRef.current > 1500) {
              lastLoadStartRef.current = now;
              setIsLoading(true);
              startLoadingTimeout();
            }

            setHasError(false);
          }}
          onLoadProgress={(event) => {
            if (event.nativeEvent.progress >= 0.8) {
              clearLoadingTimeout();
              setIsLoading(false);
            }
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


