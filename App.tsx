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

function isExternalUrl(url: string) {
  if (url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('sms:')) {
    return true;
  }

  try {
    const nextUrl = new URL(url);
    return nextUrl.host !== WEBSITE_HOST;
  } catch {
    return false;
  }
}

export default function App() {
  const webViewRef = useRef<WebViewType>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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

  const handleNavigationStateChange = useCallback((event: WebViewNavigation) => {
    setCanGoBack(event.canGoBack);
  }, []);

  const handleShouldStartLoad = useCallback((request: { url: string }) => {
    if (isExternalUrl(request.url)) {
      Linking.openURL(request.url).catch((error) => {
        console.warn('Failed to open external URL', request.url, error);
      });
      return false;
    }

    return true;
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
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
          onLoadStart={() => {
            setIsLoading(true);
            setHasError(false);
          }}
          onLoadEnd={() => setIsLoading(false)}
          onError={(event) => {
            console.warn('Website failed to load', event.nativeEvent);
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webView: {
    flex: 1,
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
