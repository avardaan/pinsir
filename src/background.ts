import { getPinnedTabs } from './utils.js';
import { CONFIG } from './config.js';

function onNewWindowCreated(window: chrome.windows.Window) {
	const newWindowId = window.id;
	if (!newWindowId) return;
	console.log(`[background] New window created: id=${newWindowId}`);

	chrome.tabs.query({ windowId: newWindowId }).then(async (allTabs) => {
		const savedTabs = await getPinnedTabs(CONFIG.PINNED_TABS_STORAGE_KEY);
		if (!savedTabs.length) {
			console.log('[background] No saved tabs to restore');
			return;
		}

		console.log(`[background] Restoring ${savedTabs.length} saved tabs`);

		// Repurpose the first existing tab (e.g. default newtab) for the first saved tab.
		// This avoids the "create new tab then remove original" visual flicker.
		const firstTab = allTabs[0];
		if (firstTab?.id) {
			await chrome.tabs.update(firstTab.id, {
				url: savedTabs[0].url,
				pinned: true,
				active: false,
			});
			console.log(`[background] Updated first tab to ${savedTabs[0].url}`);
		} else {
			// No existing tab to repurpose, create the first one from scratch
			await chrome.tabs.create({
				windowId: newWindowId,
				url: savedTabs[0].url,
				pinned: true,
				active: false,
			});
			console.log(`[background] Created first tab: ${savedTabs[0].url}`);
		}

		// Create remaining saved tabs as new tabs
		for (let i = 1; i < savedTabs.length; i++) {
			await chrome.tabs.create({
				windowId: newWindowId,
				url: savedTabs[i].url,
				pinned: true,
				active: false,
			});
			console.log(`[background] Created tab ${i}: ${savedTabs[i].url}`);
		}

		// Remove any remaining original tabs (all except the first one we repurposed)
		const remainingOriginalIds = allTabs
			.slice(1)
			.map((tab) => tab.id)
			.filter((id): id is number => id !== undefined);

		if (remainingOriginalIds.length) {
			await chrome.tabs.remove(remainingOriginalIds);
			console.log(`[background] Removed ${remainingOriginalIds.length} original tabs`);
		}
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
