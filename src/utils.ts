export async function getPinnedTabs(storageKey: string): Promise<any[]> {
  console.log(`[getPinnedTabs] Reading from storage key: ${storageKey}`);
  if (!storageKey) {
    console.log("[getPinnedTabs] No storage key provided, returning []");
    return [];
  }

  const result = await chrome.storage.sync.get([storageKey]);
  const tabs = result[storageKey] || [];
  console.log(`[getPinnedTabs] Found ${tabs.length} tabs:`, tabs);
  return tabs;
}

export async function openPinnedTabsInWindow(targetWindowId: number, pinnedTabs: any[]) {
  console.log(`[openPinnedTabsInWindow] targetWindowId=${targetWindowId}, pinnedTabs.length=${pinnedTabs.length}`);
  if (!targetWindowId) {
    console.log("[openPinnedTabsInWindow] No window ID provided");
    return;
  }

  if (!Array.isArray(pinnedTabs) || !pinnedTabs.length) {
    console.log("[openPinnedTabsInWindow] No pinned tabs provided");
    return;
  }

  for (let idx = 0; idx < pinnedTabs.length; idx++) {
    const pinnedTab = pinnedTabs[idx];
    await chrome.tabs.create({
      index: idx,
      windowId: targetWindowId,
      url: pinnedTab.url,
      pinned: true,
      active: false,
    });
  }
}


async function saveTabsToStorage(storageKey: string, tabs: any[]): Promise<void> {
  console.log(`[saveTabsToStorage] storageKey=${storageKey}, tabs.length=${tabs.length}`);
  if (!storageKey) {
    console.log("[saveTabsToStorage] No storage key provided");
    return;
  }

  if (!Array.isArray(tabs) || !tabs.length) {
    console.log("[saveTabsToStorage] No tabs provided");
    return;
  }

  try {
    await chrome.storage.sync.set({ [storageKey]: tabs });
    console.log(`[saveTabsToStorage] Saved ${tabs.length} tabs to storage`);
  } catch (err) {
    console.error('[saveTabsToStorage] Failed to save tabs:', err);
    throw err;
  }
}

export async function savePinnedTabsToStorage(pinnedTabsStorageKey: string, pinnedTabs?: any[]): Promise<void> {
  console.log(`[savePinnedTabsToStorage] called with pinnedTabsStorageKey=${pinnedTabsStorageKey}, pinnedTabs.length=${pinnedTabs?.length ?? 'undefined'}`);
  if (!pinnedTabsStorageKey) {
    console.log("[savePinnedTabsToStorage] No pinned tabs storage key provided");
    return;
  }

  let finalPinnedTabs: any[];
  if (!pinnedTabs || !pinnedTabs.length) {
    console.log("[savePinnedTabsToStorage] No pinned tabs provided, querying active pinned tabs");
    const tabs = await chrome.tabs.query({ pinned: true });
    console.log(`[savePinnedTabsToStorage] Queried ${tabs.length} pinned tabs`, tabs);
    finalPinnedTabs = tabs;
  } else {
    console.log(`[savePinnedTabsToStorage] Using provided ${pinnedTabs.length} pinned tabs`);
    finalPinnedTabs = pinnedTabs;
  }

  saveTabsToStorage(pinnedTabsStorageKey, finalPinnedTabs);
}
