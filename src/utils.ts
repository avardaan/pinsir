async function getPinnedTabs(storageKey: string): Promise<any[]> {
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

export function openPinnedTabsInWindow(targetWindowId: number, pinnedTabs: any[]) {
  console.log(`[openPinnedTabsInWindow] targetWindowId=${targetWindowId}, pinnedTabs.length=${pinnedTabs.length}`);
  if (!targetWindowId) {
    console.log("[openPinnedTabsInWindow] No window ID provided");
    return;
  }

  if (!Array.isArray(pinnedTabs) || !pinnedTabs.length) {
    console.log("[openPinnedTabsInWindow] No pinned tabs provided");
    return;
  }

  pinnedTabs.forEach((pinnedTab, idx) => {
    const pinnedTabURL = pinnedTab.url;
    chrome.tabs.create({
      index: idx,
      windowId: targetWindowId,
      url: pinnedTabURL,
      pinned: true,
      active: false,
    });
  });
}

export async function getAndOpenPinnedTabs(targetWindowId: number, pinnedTabsStorageKey: string): Promise<void> {
  const pinnedTabsFromStorage = await getPinnedTabs(pinnedTabsStorageKey);
  openPinnedTabsInWindow(targetWindowId, pinnedTabsFromStorage);
}

function saveTabsToStorage(storageKey: string, tabs: any[]): void {
  console.log(`[saveTabsToStorage] storageKey=${storageKey}, tabs.length=${tabs.length}`);
  if (!storageKey) {
    console.log("[saveTabsToStorage] No storage key provided");
    return;
  }

  if (!Array.isArray(tabs) || !tabs.length) {
    console.log("[saveTabsToStorage] No tabs provided");
    return;
  }

  chrome.storage.sync.set({ [storageKey]: tabs });
  console.log(`[saveTabsToStorage] Saved ${tabs.length} tabs to storage`);
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
