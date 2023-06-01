export const PINNED_TABS_KEY = 'pinnedTabs';

export function openPinnedTabs(windowId) {
	chrome.storage.sync.get([PINNED_TABS_KEY]).then((result) => {
		const { pinnedTabs } = result;
		// loop over pinned tabs and create them in the new window
		pinnedTabs.forEach((pinnedTab, idx) => {
			const pinnedTabURL = pinnedTab.url;
			chrome.tabs.create({
				index: idx,
				windowId,
				url: pinnedTabURL,
				pinned: true,
				active: false,
			});
		});
	});
}
