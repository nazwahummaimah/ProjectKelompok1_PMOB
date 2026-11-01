// components/molecules/FeatureTag.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface FeatureTagProps {
  label: string;
}

const FeatureTag: React.FC<FeatureTagProps> = ({ label }) => {
  return (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: '#F1F5F9', // Sesuai dengan spesifikasi soft gray badge di DESIGN.md
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusSmall,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    ...FONTS.caption,
    color: '#475569',
  }
});

export default FeatureTag;