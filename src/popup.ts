import { savePinnedTabsToStorage } from './utils.js';
import { CONFIG } from './config.js';

const SAVE_BTN_TEXT = {
	DEFAULT: 'Save Pinned Tabs',
	SAVED: 'Saved!',
};

const savePinnedTabsBtn = document.getElementById('save-pinned-tabs-btn') as HTMLButtonElement;
const openPinnedTabsBtn = document.getElementById('open-pinned-tabs-btn') as HTMLButtonElement;
const savedTabsList = document.getElementById('saved-tabs-list') as HTMLDivElement;
const savedCount = document.getElementById('saved-count') as HTMLSpanElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

savePinnedTabsBtn.addEventListener('click', savePinnedTabsFn);
openPinnedTabsBtn.addEventListener('click', openPinnedTabsFn);

// Load saved tabs on popup open
loadSavedTabs();

async function loadSavedTabs() {
	console.log("[popup] Loading saved tabs");
	const result = await chrome.storage.sync.get([CONFIG.PINNED_TABS_STORAGE_KEY]);
	const tabs = result[CONFIG.PINNED_TABS_STORAGE_KEY] || [];
	console.log(`[popup] Loaded ${tabs.length} saved tabs`);
	renderSavedTabs(tabs);
}

function renderSavedTabs(tabs: any[]) {
	savedCount.innerText = String(tabs.length);
	savedTabsList.innerHTML = '';

	if (!tabs.length) {
		const empty = document.createElement('div');
		empty.className = 'saved-tab-empty';
		empty.innerText = 'No saved tabs yet';
		savedTabsList.appendChild(empty);
		return;
	}

	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];
		const item = document.createElement('div');
		item.className = 'saved-tab-item';

		const delBtn = document.createElement('button');
		delBtn.className = 'saved-tab-delete';
		delBtn.innerText = '\u00D7';
		delBtn.title = 'Remove from saved tabs';
		delBtn.addEventListener('click', () => deleteSavedTab(i));

		const favicon = document.createElement('img');
		favicon.className = 'saved-tab-favicon';
		favicon.src = tab.favIconUrl || `https://www.google.com/s2/favicons?domain=${new URL(tab.url).hostname}&sz=32`;
		favicon.alt = '';

		const textWrap = document.createElement('div');
		textWrap.style.overflow = 'hidden';
		textWrap.style.minWidth = '0';

		const title = document.createElement('div');
		title.className = 'saved-tab-title';
		title.innerText = tab.title || new URL(tab.url).hostname;

		const urlLine = document.createElement('div');
		urlLine.className = 'saved-tab-url';
		urlLine.innerText = tab.url;

		textWrap.appendChild(title);
		textWrap.appendChild(urlLine);

		item.appendChild(delBtn);
		item.appendChild(favicon);
		item.appendChild(textWrap);
		savedTabsList.appendChild(item);
	}
}

async function deleteSavedTab(index: number) {
	console.log(`[popup] Deleting saved tab at index ${index}`);
	const result = await chrome.storage.sync.get([CONFIG.PINNED_TABS_STORAGE_KEY]);
	const tabs = (result[CONFIG.PINNED_TABS_STORAGE_KEY] || []) as any[];
	if (index < 0 || index >= tabs.length) return;
	const removed = tabs.splice(index, 1);
	await chrome.storage.sync.set({ [CONFIG.PINNED_TABS_STORAGE_KEY]: tabs });
	console.log(`[popup] Removed tab: ${removed[0]?.url}`);
	setStatus('Tab removed');
	renderSavedTabs(tabs);
}

function setStatus(msg: string, durationMs = 2000) {
	statusEl.innerText = msg;
	if (durationMs > 0) {
		setTimeout(() => { statusEl.innerText = ''; }, durationMs);
	}
}

// save or update (upsert) pinned tabs
async function savePinnedTabsFn() {
	console.log("[popup] Save button clicked");
	savePinnedTabsBtn.disabled = true;

	await savePinnedTabsToStorage(CONFIG.PINNED_TABS_STORAGE_KEY);
	console.log("[popup] Save completed");

	setStatus('Pinned tabs saved!');
	savePinnedTabsBtn.innerText = SAVE_BTN_TEXT.SAVED;

	// Refresh saved tabs display
	await loadSavedTabs();

	setTimeout(() => {
		savePinnedTabsBtn.disabled = false;
		savePinnedTabsBtn.innerText = SAVE_BTN_TEXT.DEFAULT;
	}, CONFIG.SAVE_BTN_DISABLED_TIMEOUT_MS);
}

// open pinned tabs
async function openPinnedTabsFn() {
	console.log("[popup] Open button clicked");
	await chrome.windows.create({ focused: true });
	// Background listener auto-restores saved tabs in the new window
	setStatus('Saved tabs restored!');
}
