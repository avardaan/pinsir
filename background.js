// event listener for when a new window is created
chrome.windows.onCreated.addListener((window) => {
	const newWindowId = window.id;
	// get pinned tabs saved by user
	chrome.storage.sync.get(['pinnedTabs']).then((pinnedTabs) => {
		console.log(pinnedTabs);
		// loop over pinned tabs and create them in the new window
		for (let idx = 0; idx < pinnedTabs.length; idx++) {
			const pinnedTabURL = pinnedTabs[idx];
			chrome.tabs.create({
				index: idx,
				pinned: true,
				url: pinnedTabURL,
				window: newWindowId,
			});
		}
	});
});
