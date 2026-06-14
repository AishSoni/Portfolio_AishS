'use client';

import React, { useSyncExternalStore } from 'react';
import { ToggleButton, useTheme } from '@once-ui-system/core';

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const currentTheme = mounted
    ? document.documentElement.getAttribute('data-theme') || 'light'
    : 'light';

  const icon = currentTheme === 'dark' ? 'light' : 'dark';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
