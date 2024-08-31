import { openPinnedTabs, getPinnedTabs } from './utils.js';
import { CONFIG } from './config.js';

const SAVE_BTN_TEXT = {
	DEFAULT: 'Save Pinned Tabs',
	SAVED: 'Saved!',
};

const savePinnedTabsBtn = document.getElementById('save-pinned-tabs-btn');
const openPinnedTabsBtn = document.getElementById('open-pinned-tabs-btn');

savePinnedTabsBtn.addEventListener('click', savePinnedTabsFn);
openPinnedTabsBtn.addEventListener('click', openPinnedTabsFn);

// save or update (upsert) pinned tabs
function savePinnedTabsFn() {
	// disable save button temporarily
	disablePinnedTabsBtn();
	// get pinned tabs
	
}

function disablePinnedTabsBtn() {
	savePinnedTabsBtn.disabled = true;
	savePinnedTabsBtn.innerText = SAVE_BTN_TEXT.SAVED;
	// re-enable button after timeout
	setTimeout(() => {
		savePinnedTabsBtn.disabled = false;
		savePinnedTabsBtn.innerText = SAVE_BTN_TEXT.DEFAULT;
	}, CONFIG.SAVE_BTN_DISABLED_TIMEOUT_MS);
}

// open pinned tabs
function openPinnedTabsFn() {
	const pinnedTabs = getPinnedTabs(CONFIG.PINNED_TABS_STORAGE_KEY);
	openPinnedTabs(pinnedTabs);
}
