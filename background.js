// event listener for when a new window is created
chrome.windows.onCreated.addListener((window) => {
	// get pinned tabs saved by user
	chrome.storage.sync.get(['pinnedTabs']).then((pinnedTabs) => {
		console.log('pinnedTabs in background', pinnedTabs);
	});
});
