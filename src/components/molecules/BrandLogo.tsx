import React from 'react';
import JamalJepretLogo from './JamalJepretLogo';

export type BrandLogoProps = {
  title?: string;
  subtitle?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'default' | 'large';
  iconSize?: number;
};

/** Shared brand wrapper. The artwork always comes from the official project logo. */
export function BrandLogo({ size = 'default' }: BrandLogoProps) {
  return <JamalJepretLogo width={size === 'large' ? 190 : 145} />;
}

export default BrandLogo;
