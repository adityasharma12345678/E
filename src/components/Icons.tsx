import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

// 1. Wallet Icon
export const WalletIcon: React.FC<IconProps> = ({ color = '#3155F5', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 7H3C1.89543 7 1 7.89543 1 9V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V9C23 7.89543 22.1046 7 21 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 5V3C16 1.89543 15.1046 1 14 1H10C8.89543 1 8 1.89543 8 3V5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="17.5" cy="14" r="1.5" fill={color} />
  </Svg>
);

// 2. Lock Icon
export const LockIcon: React.FC<IconProps> = ({ color = '#777586', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// 3. Eye Open / Eye Closed Icons
export const EyeIcon: React.FC<IconProps> = ({ color = '#777586', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ color = '#777586', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// 4. Shield Security Icon
export const ShieldIcon: React.FC<IconProps> = ({ color = '#3155F5', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);