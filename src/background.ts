import { getPinnedTabs } from './utils.js';
import { CONFIG } from './config.js';

function isNewEmptyWindow(tabs: chrome.tabs.Tab[]): boolean {
	if (tabs.length === 0) return true;
	if (tabs.length === 1) {
		const url = tabs[0].url || '';
		return url === '' || url.startsWith('chrome://newtab') || url.startsWith('about:blank');
	}
	return false;
}

function onNewWindowCreated(window: chrome.windows.Window) {
	const newWindowId = window.id;
	if (!newWindowId) return;
	console.log(`[background] New window created: id=${newWindowId}`);

	chrome.tabs.query({ windowId: newWindowId }).then(async (allTabs) => {
		if (!isNewEmptyWindow(allTabs)) {
			console.log('[background] Window has existing tabs, skipping restoration');
			return;
		}

		const savedTabs = await getPinnedTabs(CONFIG.PINNED_TABS_STORAGE_KEY);
		if (!savedTabs.length) {
			console.log('[background] No saved tabs to restore');
			return;
		}

		console.log(`[background] Restoring ${savedTabs.length} saved tabs into empty window`);

		const firstTab = allTabs[0];
		if (firstTab?.id) {
			await chrome.tabs.update(firstTab.id, {
				url: savedTabs[0].url,
				pinned: true,
				active: false,
			});
			console.log(`[background] Updated first tab to ${savedTabs[0].url}`);
		} else {
			await chrome.tabs.create({
				windowId: newWindowId,
				url: savedTabs[0].url,
				pinned: true,
				active: false,
			});
			console.log(`[background] Created first tab: ${savedTabs[0].url}`);
		}

		for (let i = 1; i < savedTabs.length; i++) {
			await chrome.tabs.create({
				windowId: newWindowId,
				url: savedTabs[i].url,
				pinned: true,
				active: false,
			});
			console.log(`[background] Created tab ${i}: ${savedTabs[i].url}`);
		}
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
