import { getAndOpenPinnedTabs } from './utils.js';
import { CONFIG } from './config.js';

function onNewWindowCreated(window: chrome.windows.Window) {
	const newWindowId = window.id;
	console.log(`[background] New window created: id=${newWindowId}`);

	chrome.tabs.query({ windowId: newWindowId! }).then(async (allTabs) => {
		console.log(`[background] Found ${allTabs.length} tabs in new window`);

		// Save IDs of original tabs (e.g. default newtab) so we can remove them
		const originalTabIds = allTabs.map((tab) => tab.id).filter((id): id is number => id !== undefined);

		// Create saved tabs first (keeps window alive)
		await getAndOpenPinnedTabs(newWindowId!, CONFIG.PINNED_TABS_STORAGE_KEY);

		// Remove the original tabs (default newtab, etc.)
		if (originalTabIds.length) {
			await chrome.tabs.remove(originalTabIds);
			console.log(`[background] Removed ${originalTabIds.length} original tabs`);
		}
	});
}

// event listener for when a new window is created
chrome.windows.onCreated.addListener(onNewWindowCreated, {
	windowTypes: ['normal'],
});
