import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Share, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { Button } from '../../components/Button';

export default function PDFViewerScreen({ route, navigation }: { route: any; navigation: any }) {
  const { title, url } = route.params || { title: 'Study Resource', url: '' };
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    if (!url) {
      Alert.alert('Download unavailable', 'No file URL was provided for this resource.');
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Android cannot open this file URL.');
      }
      setDownloadProgress(100);
      await Linking.openURL(url);
    } catch {
      Alert.alert('Download failed', 'Unable to open this PDF. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this study material from EduHub: ${title}\nURL: ${url}`,
        title: title,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top action header */}
      <View style={styles.actionHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Simulated PDF Canvas */}
      <View style={styles.pdfCanvas}>
        <View style={styles.canvasContent}>
          <Ionicons name="document-text" size={80} color={COLORS.primary} style={styles.pdfIcon} />
          <Text style={styles.pdfLabel}>{title}</Text>
          <Text style={styles.pdfSub}>[Simulated PDF Document View]</Text>
          <Text style={styles.pdfBody}>
            This screen displays the document in a webview / PDF reader container.
            Click the download button below to store this file on your local storage.
          </Text>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {downloading ? (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Downloading... {downloadProgress}%</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${downloadProgress}%` }]} />
            </View>
          </View>
        ) : (
          <Button
            title="Download PDF"
            onPress={handleDownload}
            style={styles.downloadBtn}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark canvas similar to typical PDF viewers
  },
  actionHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  shareBtn: {
    padding: 4,
  },
  pdfCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  canvasContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 5,
  },
  pdfIcon: {
    marginBottom: 16,
  },
  pdfLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  pdfSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  pdfBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
  progressContainer: {
    paddingVertical: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});
