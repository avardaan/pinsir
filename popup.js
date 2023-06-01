function savePinnedTabs() {
	// get pinned tabs
	chrome.tabs.query({ pinned: true }).then((tabs) => {
		const pinnedTabsURLs = tabs.map((tab) => tab.url);
		// store pinned tabs in chrome.storage
		chrome.storage.sync.set({ pinnedTabs: pinnedTabsURLs }).then(() => {
			// get the saved pinned tabs
			chrome.storage.sync.get(['pinnedTabs']).then(() => {});
		});
	});
}

// add event listener to button
const savePinnedTabsBtn = document.getElementById('save-pinned-tabs');
savePinnedTabsBtn.addEventListener('click', savePinnedTabs);
