
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      style={[
        styles.button,
        outlined && styles.outlined,
        small && styles.small,
        style,
      ]}
    >
      <Text style={[styles.text, outlined && styles.outlinedText]}>
        {title}
      </Text>

      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={outlined ? '#16833B' : '#FFFFFF'}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 39,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: '#16833B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  outlined: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#16833B',
  },
  small: {
    minHeight: 34,
    borderRadius: 10,
    paddingHorizontal: 8,
    alignSelf: 'stretch',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  outlinedText: {
    color: '#16833B',
  },
});

export default PrimaryButton;
