import { PINNED_TABS_KEY, openPinnedTabs } from './utils.js';

export const BTN_DISABLE_TIMEOUT_MS = 1500;

export const SAVE_BTN_TEXT = {
	DEFAULT: 'Save Pinned Tabs',
	SAVED: 'Saved!',
};

const upsertPinnedTabsBtn = document.getElementById('upsert-pinned-tabs-btn');
const openPinnedTabsBtn = document.getElementById('open-pinned-tabs-btn');

upsertPinnedTabsBtn.addEventListener('click', upsertPinnedTabs);
openPinnedTabsBtn.addEventListener('click', openPinnedTabsFn);

// save or update (upsert) pinned tabs
function upsertPinnedTabs() {
	// block save button temporarily
	blockUpsertPinnedTabsBtn();
	// get pinned tabs
	chrome.tabs.query({ pinned: true }).then((tabs) => {
		const pinnedTabs = tabs.map((tab) => ({
			faviconUrl: tab.favIconUrl,
			url: tab.url,
		}));
		// store pinned tabs in chrome.storage
		chrome.storage.sync.set({ [PINNED_TABS_KEY]: pinnedTabs });
	});
}

function blockUpsertPinnedTabsBtn() {
	upsertPinnedTabsBtn.disabled = true;
	upsertPinnedTabsBtn.innerText = SAVE_BTN_TEXT.SAVED;
	// re-enable button after timeout
	setTimeout(() => {
		upsertPinnedTabsBtn.disabled = false;
		upsertPinnedTabsBtn.innerText = SAVE_BTN_TEXT.DEFAULT;
	}, BTN_DISABLE_TIMEOUT_MS);
}

// open pinned tabs
function openPinnedTabsFn() {
	openPinnedTabs();
}
