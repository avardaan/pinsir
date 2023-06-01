import { openPinnedTabs } from './utils.js';

// add event listener to upsert button
const upsertPinnedTabsBtn = document.getElementById('upsert-pinned-tabs-btn');
upsertPinnedTabsBtn.addEventListener('click', upsertPinnedTabs);

// save or update (upsert) pinned tabs
function upsertPinnedTabs() {
	// get pinned tabs
	chrome.tabs.query({ pinned: true }).then((tabs) => {
		const pinnedTabs = tabs.map((tab) => ({
			faviconUrl: tab.favIconUrl,
			url: tab.url,
		}));
		// store pinned tabs in chrome.storage
		chrome.storage.sync.set({ pinnedTabs: pinnedTabs });
	});
}

// add event listener to open tabs button
const openPinnedTabsBtn = document.getElementById('open-pinned-tabs-btn');
openPinnedTabsBtn.addEventListener('click', openPinnedTabsFn);

// open pinned tabs
function openPinnedTabsFn() {
	openPinnedTabs();
}
