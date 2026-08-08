import { Alert, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { BASE_URL } from '../config/env';
import { getQuotationPdfExportPath } from '../features/quotations/quotationsAPI';
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

/**
 * Download quotation PDF and show success toast.
 * @param {{ quoteId: string|number, accessToken: string, onStart?: Function, onEnd?: Function, onSuccessToast?: Function, onErrorToast?: Function }} options
 */
export const exportQuotationPdf = async ({
  quoteId,
  accessToken,
  onStart,
  onEnd,
  onSuccessToast,
  onErrorToast,
} = {}) => {
  if (!quoteId) {
    Alert.alert('Unavailable', 'Save the quotation first to export a PDF.');
    return;
  }

  const relativePath = getQuotationPdfExportPath(quoteId);
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
    const fileName = `quotation_${quoteId}_${Date.now()}.pdf`;
    const downloadDir = Platform.OS === 'ios'
      ? fs.dirs.DocumentDir
      : (fs.dirs.DownloadDir || fs.dirs.LegacyDownloadDir || fs.dirs.DocumentDir);
    const filePath = `${downloadDir}/${fileName}`;

    const configOptions = Platform.OS === 'ios'
      ? { fileCache: true, path: filePath }
      : {
          fileCache: true,
          path: filePath,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            description: 'Downloading quotation PDF',
            mediaScannable: true,
            path: filePath,
            mime: 'application/pdf',
            title: fileName,
          },
        };

    await config(configOptions).fetch('GET', fileUrl, {
      Authorization: `Bearer ${accessToken}`,
    });

    onSuccessToast?.({ title: 'Success', message: 'Quotation downloaded successfully.' });
  } catch (error) {
    console.log('export pdf error', error);
    onErrorToast?.({
      title: 'Failed',
      message: error?.response?.data?.message || 'Something went wrong. Please try again later.',
    });
  } finally {
    onEnd?.();
  }
};
