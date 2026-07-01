import { describe, it, expect, beforeEach } from 'bun:test';
import { resetMocks, getStorage, getCreatedTabs, addMockTab } from './test/setup.js';
import { openPinnedTabsInWindow, savePinnedTabsToStorage, getAndOpenPinnedTabs } from './utils.js';

describe('utils', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('savePinnedTabsToStorage', () => {
    it('should save provided tabs to storage', async () => {
      const tabs = [
        { id: 1, url: 'https://example.com', title: 'Example', pinned: true },
        { id: 2, url: 'https://github.com', title: 'GitHub', pinned: true },
      ];

      await savePinnedTabsToStorage('pinnedTabs', tabs);

      const storage = getStorage();
      expect(storage['pinnedTabs']).toHaveLength(2);
      expect(storage['pinnedTabs'][0].url).toBe('https://example.com');
      expect(storage['pinnedTabs'][1].url).toBe('https://github.com');
    });

    it('should query and save active pinned tabs when none provided', async () => {
      addMockTab({ id: 1, url: 'https://google.com', title: 'Google', pinned: true, currentWindow: true });
      addMockTab({ id: 2, url: 'https://docs.google.com', title: 'Docs', pinned: true, currentWindow: true });
      addMockTab({ id: 3, url: 'https://news.ycombinator.com', title: 'HN', pinned: false, currentWindow: true });

      await savePinnedTabsToStorage('pinnedTabs');

      const storage = getStorage();
      expect(storage['pinnedTabs']).toHaveLength(2);
      expect(storage['pinnedTabs'].map((t: any) => t.url)).toContain('https://google.com');
      expect(storage['pinnedTabs'].map((t: any) => t.url)).toContain('https://docs.google.com');
      expect(storage['pinnedTabs'].map((t: any) => t.url)).not.toContain('https://news.ycombinator.com');
    });

    it('should return early when storage key is missing', async () => {
      await savePinnedTabsToStorage('', [{ id: 1, url: 'https://test.com' }]);
      const storage = getStorage();
      expect(storage['']).toBeUndefined();
    });

    it('should return early when empty tabs array provided', async () => {
      await savePinnedTabsToStorage('pinnedTabs', []);
      const storage = getStorage();
      expect(storage['pinnedTabs']).toBeUndefined();
    });
  });

  describe('openPinnedTabsInWindow', () => {
    it('should create all pinned tabs in the target window', () => {
      const tabs = [
        { url: 'https://a.com', title: 'A' },
        { url: 'https://b.com', title: 'B' },
        { url: 'https://c.com', title: 'C' },
      ];

      openPinnedTabsInWindow(42, tabs);

      const created = getCreatedTabs();
      expect(created).toHaveLength(3);
      expect(created[0]).toMatchObject({ index: 0, windowId: 42, url: 'https://a.com', pinned: true, active: false });
      expect(created[1]).toMatchObject({ index: 1, windowId: 42, url: 'https://b.com', pinned: true, active: false });
      expect(created[2]).toMatchObject({ index: 2, windowId: 42, url: 'https://c.com', pinned: true, active: false });
    });

    it('should return early when windowId is falsy', () => {
      openPinnedTabsInWindow(0, [{ url: 'https://test.com' }]);
      expect(getCreatedTabs()).toHaveLength(0);
    });

    it('should return early when tabs array is empty', () => {
      openPinnedTabsInWindow(42, []);
      expect(getCreatedTabs()).toHaveLength(0);
    });
  });

  describe('getAndOpenPinnedTabs', () => {
    it('should read stored tabs and create them in target window', async () => {
      const storage = getStorage();
      storage['pinnedTabs'] = [
        { url: 'https://mail.google.com', title: 'Gmail' },
        { url: 'https://calendar.google.com', title: 'Calendar' },
      ];

      await getAndOpenPinnedTabs(7, 'pinnedTabs');

      const created = getCreatedTabs();
      expect(created).toHaveLength(2);
      expect(created[0].windowId).toBe(7);
      expect(created[1].windowId).toBe(7);
    });

    it('should handle missing storage key gracefully', async () => {
      await getAndOpenPinnedTabs(7, 'nonexistent');
      expect(getCreatedTabs()).toHaveLength(0);
    });
  });
});
