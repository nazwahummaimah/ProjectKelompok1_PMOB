import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  outlined?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  title,
  onPress,
  icon,
  outlined = false,
  small = false,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        outlined && styles.outlined,
        small && styles.small,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, outlined && styles.outlinedText]}>
        {title}
      </Text>

      {icon ? (
        <Ionicons
          name={icon}
          size={16}
          color={outlined ? COLORS.secondaryDark : COLORS.textPrimary}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlined: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondaryDark,
  },
  small: {
    minHeight: 44,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.82,
  },
  text: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  outlinedText: {
    color: COLORS.secondaryDark,
  },
});

export default PrimaryButton;
