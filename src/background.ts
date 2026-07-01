import { openPinnedTabsInWindow, getAndOpenPinnedTabs } from './utils.js';
import { CONFIG } from './config.js';

function onNewWindowCreated(window: chrome.windows.Window) {
	const newWindowId = window.id;
	console.log(`[background] New window created: id=${newWindowId}`);
	// check existing pinned tabs in new window
	chrome.tabs.query({ pinned: true, currentWindow: true }).then(async (openedPinnedTabs) => {
		console.log(`[background] Found ${openedPinnedTabs.length} existing pinned tabs in new window`);
		// if no existing pinned tabs, open saved tabs
		if (Array.isArray(openedPinnedTabs) && !openedPinnedTabs.length) {
			console.log("[background] No existing pinned tabs, restoring saved tabs");
			await getAndOpenPinnedTabs(newWindowId!, CONFIG.PINNED_TABS_STORAGE_KEY);
		} else {
			// if there are existing pinned tabs, close them and open saved tabs
			console.log(`[background] Closing ${openedPinnedTabs.length} existing pinned tabs and restoring saved tabs`);
			const openedPinnedTabIds = openedPinnedTabs.map((tab) => tab.id).filter((id): id is number => id !== undefined);
			await chrome.tabs.remove(openedPinnedTabIds);
			await getAndOpenPinnedTabs(newWindowId!, CONFIG.PINNED_TABS_STORAGE_KEY);
		}
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
