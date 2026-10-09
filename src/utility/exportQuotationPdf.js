import { Alert, Linking, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { BASE_URL } from '../config/env';
import { getQuotationExcelExportPath, getQuotationPdfExportPath } from '../features/quotations/quotationsAPI';
import { checkPermission } from './permissions';

/** Pull quotation id from calculate/save API response payloads */
export const extractQuotationId = (payload = {}) => {
  if (!payload || typeof payload !== 'object') return null;
  return (
    payload?.quotation?.id
    ?? payload?.quotationId
    ?? payload?.quoteDetails?.id
    ?? payload?.savedQuotation?.id
    ?? payload?.data?.quotation?.id
    ?? payload?.data?.id
    ?? payload?.id
    ?? null
  );
};

const toLocalPath = (value = '') => String(value || '').replace(/^file:\/\//, '');

const isContentUri = (value = '') => /^content:\/\//i.test(String(value || ''));

const resolveOpenPath = async (preferredPath, fallbackPath) => {
  const preferred = String(preferredPath || '').trim();
  const fallback = toLocalPath(fallbackPath);

  if (isContentUri(preferred)) {
    return preferred;
  }

  const localPreferred = toLocalPath(preferred);
  const { fs } = ReactNativeBlobUtil;

  if (localPreferred && await fs.exists(localPreferred)) {
    return localPreferred;
  }

  if (fallback && await fs.exists(fallback)) {
    return fallback;
  }

  return localPreferred || fallback || '';
};

const formatOpenError = (error) => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    const code = error?.code || error?.errno || error?.name;
    const message = error?.message || error?.detail || error?.error;
    return [code, message].filter(Boolean).join(': ');
  }
  return String(error);
};

const openWithChooser = async (preferredPath, fallbackPath, {
  mimeTypes = ['application/pdf', 'application/x-pdf', 'application/octet-stream'],
  chooserTitle = 'Open PDF with',
  fileLabel = 'PDF',
} = {}) => {
  const path = await resolveOpenPath(preferredPath, fallbackPath);
  if (!path) {
    Alert.alert('Unable to open', 'Downloaded file path is missing.');
    return;
  }

  if (!isContentUri(path)) {
    const exists = await ReactNativeBlobUtil.fs.exists(path);
    if (!exists) {
      Alert.alert(
        `Unable to open ${fileLabel}`,
        'The downloaded file could not be found. Try opening it from Downloads using File location.',
      );
      return;
    }
  }

  try {
    if (Platform.OS === 'android') {
      // 1) First, try opening the default handler (no chooser).
      for (const mime of mimeTypes) {
        try {
          // actionViewIntent(path, mime) will NOT create a chooser if chooserTitle is omitted.
          await ReactNativeBlobUtil.android.actionViewIntent(path, mime);
          return;
        } catch (e) {
          // Try next MIME type
        }
      }

      // 2) If none worked, show chooser using the more common PDF MIME types.
      //    This is where "WhatsApp-like" auto resolution usually happens when a viewer exists.
      const lastMime = mimeTypes[mimeTypes.length - 1];
      await ReactNativeBlobUtil.android.actionViewIntent(
        path,
        lastMime,
        chooserTitle,
      );
    } else {
      await ReactNativeBlobUtil.ios.presentOpenInMenu(path);
    }
  } catch (error) {
    console.log('open pdf chooser error', error);
    Alert.alert(
      `Unable to open ${fileLabel}`,
      `No app found (or unable to resolve viewer).\n${formatOpenError(error)}`,
    );
  }
};

const openFileLocation = async (dirPath) => {
  try {
    if (Platform.OS === 'android') {
      try {
        await Linking.sendIntent('android.intent.action.VIEW_DOWNLOADS');
        return;
      } catch (error) {
        await ReactNativeBlobUtil.android.actionViewIntent(
          toLocalPath(dirPath),
          'vnd.android.document/directory',
          'Open folder with',
        );
      }
      return;
    }

    try {
      await Linking.openURL('shareddocuments://');
    } catch (error) {
      Alert.alert('File location', 'Files → On My iPhone → Tia');
    }
  } catch (error) {
    console.log('open file location error', error);
    Alert.alert(
      'File location',
      dirPath ? `Saved to:\n${dirPath}` : 'The file was saved to Downloads.',
    );
  }
};

const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const downloadQuotationFile = async ({
  quoteId,
  accessToken,
  relativePath,
  extension,
  mime,
  label,
  mimeTypes,
  chooserTitle,
  onStart,
  onEnd,
  onErrorToast,
}) => {
  if (!quoteId) {
    Alert.alert('Unavailable', `Save the quotation first to export a ${label}.`);
    return;
  }

  if (!relativePath) {
    Alert.alert('Unavailable', 'Export file is not available for this quotation.');
    return;
  }

  try {
    const needsStoragePermission = Platform.OS === 'android' && Platform.Version <= 28;
    if (needsStoragePermission) {
      const allowed = await checkPermission();
      if (!allowed) return;
    }

    onStart?.();

    const fileUrl = relativePath.startsWith('http') ? relativePath : `${BASE_URL}${relativePath}`;
    const { config, fs } = ReactNativeBlobUtil;
    const fileName = `quotation_${quoteId}_${Date.now()}.${extension}`;
    const usePublicDownloads = Platform.OS === 'android' && Platform.Version >= 29;
    const downloadDir = Platform.OS === 'ios'
      ? fs.dirs.DocumentDir
      : (fs.dirs.LegacyDownloadDir || fs.dirs.DownloadDir || fs.dirs.DocumentDir);
    const filePath = `${downloadDir}/${fileName}`;

    const configOptions = Platform.OS === 'ios'
      ? { fileCache: true, path: filePath }
      : {
          fileCache: true,
          path: filePath,
          addAndroidDownloads: usePublicDownloads
            ? {
                useDownloadManager: true,
                notification: true,
                description: `Downloading quotation ${label}`,
                mediaScannable: true,
                mime,
                title: fileName,
                storeInDownloads: true,
              }
            : {
                useDownloadManager: true,
                notification: true,
                description: `Downloading quotation ${label}`,
                mediaScannable: true,
                path: filePath,
                mime,
                title: fileName,
              },
        };

    const response = await config(configOptions).fetch('GET', fileUrl, {
      Authorization: `Bearer ${accessToken}`,
    });

    const responsePath = response?.path?.() || filePath;
    const openPath = isContentUri(responsePath) ? responsePath : filePath;

    Alert.alert(
      'Download complete',
      Platform.OS === 'android'
        ? `Quotation ${label} saved to Downloads.`
        : `Quotation ${label} saved successfully.`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'File location', onPress: () => openFileLocation(downloadDir) },
        {
          text: 'Open with…',
          onPress: () => openWithChooser(openPath, filePath, { mimeTypes, chooserTitle, fileLabel: label }),
        },
      ],
    );
  } catch (error) {
    console.log(`export ${label} error`, error);
    onErrorToast?.({
      title: 'Failed',
      message: error?.response?.data?.message || 'Something went wrong. Please try again later.',
    });
  } finally {
    onEnd?.();
  }
};

/**
 * Download quotation PDF, then let the user open it with an app or go to the file location.
 */
export const exportQuotationPdf = (options = {}) => downloadQuotationFile({
  ...options,
  relativePath: options.relativePath || getQuotationPdfExportPath(options.quoteId),
  extension: 'pdf',
  mime: 'application/pdf',
  label: 'PDF',
  mimeTypes: ['application/pdf', 'application/x-pdf', 'application/octet-stream'],
  chooserTitle: 'Open PDF with',
});

/** Download quotation Excel, then let the user open it. */
export const exportQuotationExcel = (options = {}) => downloadQuotationFile({
  ...options,
  relativePath: options.relativePath || getQuotationExcelExportPath(options.quoteId),
  extension: 'xlsx',
  mime: EXCEL_MIME,
  label: 'Excel',
  mimeTypes: [EXCEL_MIME, 'application/vnd.ms-excel', 'application/octet-stream'],
  chooserTitle: 'Open Excel with',
});
