import { openPinnedTabs } from './utils.js';

function onNewWindowCreated(window) {
	const newWindowId = window.id;
	// check existing pinned tabs
	chrome.tabs.query({ pinned: true }).then((openedPinnedTabs) => {
		// close existing pinned tabs, if any
		const openedPinnedTabIds = openedPinnedTabs.map((tab) => tab.id);
		chrome.tabs.remove(openedPinnedTabIds).then(() => {
			// open fresh pinned tabs
			openPinnedTabs(newWindowId);
		});
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
