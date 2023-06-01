function savePinnedTabs() {
	// get pinned tabs
	chrome.tabs.query({ pinned: true }).then((tabs) => {
		// store pinned tabs in chrome.storage
		chrome.storage.sync.set({ pinnedTabs: tabs }).then(() => {
			// get the saved pinned tabs
			chrome.storage.sync.get(['pinnedTabs']).then((result) => {
				console.log('result', result);
			});
		});
	});
}

// add event listener to button
const savePinnedTabsBtn = document.getElementById('save-pinned-tabs');
savePinnedTabsBtn.addEventListener('click', savePinnedTabs);
