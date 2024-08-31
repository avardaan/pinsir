import { openPinnedTabsInWindow, getPinnedTabs } from './utils.js';
import { CONFIG } from './config.js';

function onNewWindowCreated(window) {
	const newWindowId = window.id;
	// check existing pinned tabs in new window
	chrome.tabs.query({ pinned: true, currentWindow: true }).then((openedPinnedTabs) => {
		// if no existing pinned tabs, open saved tabs
		if (Array.isArray(openedPinnedTabs) && !openedPinnedTabs.length) {
			const pinnedTabs = getPinnedTabs(CONFIG.PINNED_TABS_STORAGE_KEY);
			openPinnedTabsInWindow(newWindowId, pinnedTabs);
		} else {
			// if there are existing pinned tabs, close them and open saved tabs
			const openedPinnedTabIds = openedPinnedTabs.map((tab) => tab.id);
			chrome.tabs.remove(openedPinnedTabIds).then(() => {
				const pinnedTabs = getPinnedTabs(CONFIG.PINNED_TABS_STORAGE_KEY);
				openPinnedTabsInWindow(newWindowId, pinnedTabs);
			});
		}
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
