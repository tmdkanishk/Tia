import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color } from '../utility/color';

/**
 * Sticky Export PDF + Update Quotation footer (same UX as Quote Detail).
 */
const QuotationActionFooter = ({
  onExportPdf,
  onUpdate,
  disabled = false,
  accentColor = color.primaryBlueDark,
  exportLabel = 'Export PDF',
  updateLabel = 'Update Quotation',
}) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View pointerEvents="box-none" style={[styles.stickyFooter, { paddingBottom: bottomPad }]}>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={onExportPdf}
        style={[styles.footerBtn, styles.footerBtnSecondary, disabled && styles.disabled]}
      >
        <Text style={[styles.footerBtnText, { color: color.primaryBlueDark }]}>{exportLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={onUpdate}
        style={[
          styles.footerBtn,
          { backgroundColor: accentColor, borderColor: accentColor },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.footerBtnText, { color: color.white }]}>{updateLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuotationActionFooter;

const styles = StyleSheet.create({
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.borderColor,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  footerBtnSecondary: {
    backgroundColor: color.white,
    borderColor: color.primaryBlueDark,
  },
  footerBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
