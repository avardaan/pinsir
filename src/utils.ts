function getTabsFromStorage(storageKey) {
  if (!storageKey) {
    console.log("No storage key provided");
    return;
  }

  chrome.storage.sync.get([storageKey]).then((result) => {
    const { tabs } = result;
    return tabs;
  });
}

function openPinnedTabsInWindow(targetWindowId, pinnedTabs) {
  if (!targetWindowId) {
    console.log("No window ID provided");
    return;
  }

  if (!Array.isArray(pinnedTabs) || !pinnedTabs.length) {
    console.log("No pinned tabs provided");
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

export function getAndOpenPinnedTabs(targetWindowId, pinnedTabsStorageKey) {
  const pinnedTabsFromStorage = getTabsFromStorage(pinnedTabsStorageKey);
  openPinnedTabsInWindow(targetWindowId, pinnedTabsFromStorage);
}

function saveTabsToStorage(storageKey, tabs) {
  if (!storageKey) {
    console.log("No storage key provided");
    return;
  }

  if (!Array.isArray(tabs) || !tabs.length) {
    console.log("No tabs provided");
    return;
  }

  chrome.storage.sync.set({ [storageKey]: tabs });
}

export function savePinnedTabsToStorage(pinnedTabsStorageKey, pinnedTabs) {
  if (!pinnedTabsStorageKey) {
    console.log("No pinned tabs storage key provided");
    return;
  }

  let finalPinnedTabs = new Array();
  if (!Array.isArray(pinnedTabs) || !pinnedTabs.length) {
    console.log("No pinned tabs provided, getting active pinned tabs");
    chrome.tabs.query({ pinned: true }).then((tabs) => {
      finalPinnedTabs = tabs;
    });
  } else {
    finalPinnedTabs = pinnedTabs;
  }

  saveTabsToStorage(pinnedTabsStorageKey, finalPinnedTabs);
}
