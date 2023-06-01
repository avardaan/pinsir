// event listener for when a new window is created
chrome.windows.onCreated.addListener((window) => {
	const newWindowId = window.id;
	// get pinned tabs saved by user
	chrome.storage.sync.get(['pinnedTabs']).then((result) => {
		const { pinnedTabs } = result;
		console.log("🚀 ~ file: background.js:7 ~ chrome.storage.sync.get ~ pinnedTabs:", pinnedTabs)
		// loop over pinned tabs and create them in the new window
		for (let idx = 0; idx < pinnedTabs.length; idx++) {
			const pinnedTabURL = pinnedTabs[idx].url;
			chrome.tabs.create({
				index: idx,
				windowId: newWindowId,
				url: pinnedTabURL,
				pinned: true,
				active: false,
			});
		}
	});
});
