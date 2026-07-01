import { describe, it, expect } from 'vitest';
import { CONFIG } from './config.js';

describe('config', () => {
  it('should have a pinned tabs storage key', () => {
    expect(CONFIG.PINNED_TABS_STORAGE_KEY).toBe('pinnedTabs');
  });

  it('should have a save button disabled timeout', () => {
    expect(typeof CONFIG.SAVE_BTN_DISABLED_TIMEOUT_MS).toBe('number');
    expect(CONFIG.SAVE_BTN_DISABLED_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it('should not change unexpectedly', () => {
    expect(CONFIG).toEqual({
      PINNED_TABS_STORAGE_KEY: 'pinnedTabs',
      SAVE_BTN_DISABLED_TIMEOUT_MS: 1500,
    });
  });
});
