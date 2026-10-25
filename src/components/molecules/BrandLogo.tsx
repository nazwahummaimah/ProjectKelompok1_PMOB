
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type BrandLogoProps = {
  title?: string;
  subtitle?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'default' | 'large';
  iconSize?: number;
};

export function BrandLogo({
  title = 'Jamal Jepret',
  subtitle = 'Penyewaan Sepeda',
  layout = 'horizontal',
  size = 'default',
  iconSize,
}: BrandLogoProps) {
  const vertical = layout === 'vertical';
  const large = size === 'large';

  return (
    <View
      style={[
        styles.container,
        vertical && styles.vertical,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          vertical && styles.iconWrapVertical,
        ]}
      >
        <MaterialCommunityIcons
          name="bicycle"
          size={iconSize ?? (large ? 66 : 43)}
          color="#16833B"
        />
      </View>

      <View
        style={[
          styles.textWrap,
          vertical && styles.textWrapVertical,
        ]}
      >
        <Text
          style={[
            styles.title,
            large && styles.titleLarge,
            vertical && styles.titleVertical,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.subtitle,
            vertical && styles.subtitleVertical,
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapVertical: {
    width: 'auto',
    marginBottom: 12,
  },
  textWrap: {
    flex: 1,
    marginLeft: 3,
  },
  textWrapVertical: {
    flex: 0,
    marginLeft: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    color: '#16833B',
  },
  titleLarge: {
    fontSize: 25,
    lineHeight: 31,
  },
  titleVertical: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: '#61766A',
    marginTop: 1,
  },
  subtitleVertical: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
});

export default BrandLogo;