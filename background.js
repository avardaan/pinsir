import { openPinnedTabs } from './utils.js';

// event listener for when a new window is created
chrome.windows.onCreated.addListener((window) => {
	const newWindowId = window.id;
	// open pinned tabs
	openPinnedTabs(newWindowId);
});
