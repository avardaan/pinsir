// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	if (tab.pinned) {
// 		var pinnedTabs = [];
// 		for (var i = 0; i < tab.windows.length; i++) {
// 			pinnedTabs.push(tab.windows[i].id);
// 		}
// 	}
// });

// event listener for when a new window is created
chrome.windows.onCreated.addListener((window) => {
  // get pinned tabs
  chrome.tabs.query({ pinned: true }, (tabs) => {
    console.log('PINNEDtabs', tabs);
  });

})
