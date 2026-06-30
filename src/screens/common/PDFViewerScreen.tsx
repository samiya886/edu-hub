import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { Button } from '../../components/Button';
import {
  assertReachableFile,
  canPreviewInApp,
  getDocumentKind,
  getDownloadFileName,
  getDownloadUrl,
  resolveFileUrl,
} from '../../utils/files';

export default function PDFViewerScreen({ route, navigation }: { route: any; navigation: any }) {
  const { title = 'Study Resource', url = '', mimeType } = route.params || {};
  const fileUrl = useMemo(() => resolveFileUrl(url), [url]);
  const fileName = useMemo(() => getDownloadFileName(title, fileUrl, mimeType), [fileUrl, mimeType, title]);
  const documentKind = useMemo(() => getDocumentKind(fileUrl, mimeType), [fileUrl, mimeType]);
  const previewable = useMemo(() => canPreviewInApp(fileUrl, mimeType), [fileUrl, mimeType]);
  const [busyAction, setBusyAction] = useState<'open' | 'download' | ''>('');
  const [viewerLoading, setViewerLoading] = useState(previewable);
  const [viewerError, setViewerError] = useState('');

  useEffect(() => {
    let active = true;

    if (!fileUrl) {
      setViewerLoading(false);
      setViewerError('No valid file URL was provided for this resource.');
      return () => {
        active = false;
      };
    }

    if (!previewable || Platform.OS === 'web') {
      setViewerLoading(false);
      setViewerError('');
      return () => {
        active = false;
      };
    }

    setViewerLoading(true);
    setViewerError('');
    assertReachableFile(fileUrl)
      .catch((error: any) => {
        if (active) {
          setViewerError(error.message || 'This file is missing or the URL is invalid.');
        }
      })
      .finally(() => {
        if (active) {
          setViewerLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [fileUrl, previewable]);

  const showMissingFile = () => {
    Alert.alert('File unavailable', 'This file is missing or the URL is invalid.');
  };

  const openExternal = async () => {
    if (!fileUrl) {
      showMissingFile();
      return;
    }

    setBusyAction('open');
    try {
      await assertReachableFile(fileUrl);
      await Linking.openURL(fileUrl);
    } catch (error: any) {
      Alert.alert('Open failed', error.message || 'Unable to open this file.');
    } finally {
      setBusyAction('');
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) {
      showMissingFile();
      return;
    }

    setBusyAction('download');
    try {
      await assertReachableFile(fileUrl);
      await Linking.openURL(getDownloadUrl(fileUrl, fileName));
    } catch (error: any) {
      Alert.alert('Download failed', error.message || 'Unable to download this file.');
    } finally {
      setBusyAction('');
    }
  };

  const renderPreview = () => {
    if (!fileUrl || viewerError) {
      return (
        <View style={styles.messageCard}>
          <Ionicons name="alert-circle-outline" size={54} color={COLORS.error} />
          <Text style={styles.messageTitle}>File unavailable</Text>
          <Text style={styles.messageText}>{viewerError || 'No valid file URL was provided for this resource.'}</Text>
        </View>
      );
    }

    if (!previewable || Platform.OS === 'web') {
      return (
        <View style={styles.messageCard}>
          <Ionicons name="document-attach-outline" size={64} color={COLORS.primary} />
          <Text style={styles.messageTitle}>{documentKind}</Text>
          <Text style={styles.messageText}>
            This file type opens in the browser or an installed document app. Use Open or Download below.
          </Text>
        </View>
      );
    }

    if (viewerLoading) {
      return (
        <View style={styles.messageCard}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.viewerLoaderText}>Opening file...</Text>
        </View>
      );
    }

    return (
      <View style={styles.viewerWrap}>
        <WebView
          source={{ uri: fileUrl }}
          style={styles.webview}
          originWhitelist={['*']}
          onError={() => {
            setViewerError('Unable to preview this file. You can still open or download it.');
          }}
          onHttpError={(event) => {
            setViewerError(`File unavailable. Server returned ${event.nativeEvent.statusCode}.`);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionHeader}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{fileName}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={openExternal} disabled={busyAction === 'open'}>
          {busyAction === 'open' ? <ActivityIndicator size="small" color={COLORS.text} /> : <Ionicons name="open-outline" size={22} color={COLORS.text} />}
        </TouchableOpacity>
      </View>

      <View style={styles.previewArea}>{renderPreview()}</View>

      <View style={styles.bottomBar}>
        <Button
          title={busyAction === 'download' ? 'Preparing download...' : `Download ${documentKind}`}
          onPress={handleDownload}
          loading={busyAction === 'download'}
          style={styles.downloadBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  actionHeader: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  previewArea: {
    flex: 1,
    padding: 14,
  },
  viewerWrap: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  viewerLoader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  viewerLoaderText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontWeight: '800',
  },
  messageCard: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  messageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  downloadBtn: {
    width: '100%',
  },
});
