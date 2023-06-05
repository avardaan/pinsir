import { openPinnedTabs } from './utils.js';

function onNewWindowCreated(window) {
	const newWindowId = window.id;
	// check existing pinned tabs in new window
	chrome.tabs.query({ pinned: true, currentWindow: true }).then((openedPinnedTabs) => {
		// if no existing pinned tabs, open saved tabs
		if (Array.isArray(openPinnedTabs) && !openPinnedTabs.length) {
			openPinnedTabs(newWindowId);
		} else {
			// if there are existing pinned tabs, close them and open saved tabs
			const openedPinnedTabIds = openedPinnedTabs.map((tab) => tab.id);
			chrome.tabs.remove(openedPinnedTabIds).then(() => openPinnedTabs(newWindowId));
		}
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
