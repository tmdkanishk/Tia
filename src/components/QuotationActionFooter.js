import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color } from '../utility/color';

/**
 * Sticky quotation actions.
 * Quote detail uses a 2x2 grid: Export PDF, Export Excel, Clone, Update.
 * Calculator screens keep a single row when Excel / Clone are not passed.
 */
const QuotationActionFooter = ({
  onExportPdf,
  onExportExcel,
  onUpdate,
  onClone,
  disabled = false,
  accentColor = color.primaryBlueDark,
  exportLabel = 'Export PDF',
  excelLabel = 'Export Excel',
  updateLabel = 'Update Quotation',
  cloneLabel = 'Clone Quotation',
}) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);
  const showGrid = !!onExportExcel && !!onClone;

  const pdfButton = (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onExportPdf}
      style={[styles.footerBtn, styles.footerBtnSecondary, disabled && styles.disabled]}
    >
      <Text style={[styles.footerBtnText, { color: color.primaryBlue }]} numberOfLines={2}>
        {exportLabel}
      </Text>
    </TouchableOpacity>
  );

  const updateButton = (
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
      <Text style={[styles.footerBtnText, { color: color.white }]} numberOfLines={2}>
        {updateLabel}
      </Text>
    </TouchableOpacity>
  );

  if (!showGrid) {
    return (
      <View pointerEvents="box-none" style={[styles.stickyFooter, { paddingBottom: bottomPad }]}>
        {pdfButton}
        {onClone ? (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={disabled}
            onPress={onClone}
            style={[
              styles.footerBtn,
              styles.footerBtnSecondary,
              { borderColor: accentColor },
              disabled && styles.disabled,
            ]}
          >
            <Text style={[styles.footerBtnText, { color: accentColor }]} numberOfLines={2}>
              {cloneLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
        {updateButton}
      </View>
    );
  }

  return (
    <View pointerEvents="box-none" style={[styles.stickyFooter, styles.grid, { paddingBottom: bottomPad }]}>
      <View style={styles.row}>
        {pdfButton}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={disabled}
          onPress={onExportExcel}
          style={[styles.footerBtn, styles.excelBtn, disabled && styles.disabled]}
        >
          <Text style={[styles.footerBtnText, { color: color.successGreen }]} numberOfLines={2}>
            {excelLabel}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={disabled}
          onPress={onClone}
          style={[
            styles.footerBtn,
            styles.footerBtnSecondary,
            { borderColor: accentColor },
            disabled && styles.disabled,
          ]}
        >
          <Text style={[styles.footerBtnText, { color: accentColor }]} numberOfLines={2}>
            {cloneLabel}
          </Text>
        </TouchableOpacity>
        {updateButton}
      </View>
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
  grid: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerBtn: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  footerBtnSecondary: {
    backgroundColor: color.white,
    borderColor: color.primaryBlue,
  },
  excelBtn: {
    backgroundColor: color.white,
    borderColor: color.successGreen,
  },
  footerBtnText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
