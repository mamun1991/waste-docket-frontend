import {ReactNode} from 'react';

export type MenuItemTypes = {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: ReactNode;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  isDivider?: boolean;
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
};

const MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'home',
    label: 'Home',
    url: '/',
    isTitle: false,
  },
  {
    key: 'privacy',
    label: 'Privacy',
    url: '/privacyPolicy',
    isTitle: false,
  },
  {
    key: 'tos',
    label: 'Terms of Service',
    url: '/tos',
    isTitle: false,
  },
  {
    key: 'about',
    label: 'About',
    url: '/about',
    isTitle: false,
  },
  {
    key: 'signup',
    label: 'Signup',
    url: '/auth/signup',
    isTitle: false,
  },
  {
    key: 'login',
    label: 'Login',
    url: '/auth/signin',
    isTitle: false,
  },
];

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'home',
    label: 'Home',
    url: '/',
    isTitle: true,
  },
  {
    key: 'privacy',
    label: 'Privacy',
    url: '/privacyPolicy',
    isTitle: false,
  },
  {
    key: 'tos',
    label: 'Terms of Service',
    url: '/tos',
    isTitle: false,
  },
  {
    key: 'about',
    label: 'About',
    url: '/about',
    isTitle: false,
  },
  {
    key: 'login',
    label: 'Login',
    url: '/auth/signin',
    isTitle: false,
  },
];

export {HORIZONTAL_MENU_ITEMS, MENU_ITEMS};
