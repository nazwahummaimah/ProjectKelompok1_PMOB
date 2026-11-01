import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

type ValidationMessageProps = {
  error?: string;
  success?: string;
};

/** Reusable inline validation feedback for public forms. */
const ValidationMessage: React.FC<ValidationMessageProps> = ({ error, success }) => {
  if (!error && !success) return null;

  const isError = Boolean(error);
  return (
    <View style={styles.row} accessibilityLiveRegion="polite">
      <Ionicons
        name={isError ? 'alert-circle-outline' : 'checkmark-circle-outline'}
        size={14}
        color={isError ? COLORS.accentCritical : COLORS.success}
        style={styles.icon}
      />
      <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>
        {error || success}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  icon: { marginRight: 4 },
  text: { ...FONTS.caption, flex: 1 },
  errorText: { color: COLORS.accentCritical },
  successText: { color: COLORS.success },
});

export default ValidationMessage;
