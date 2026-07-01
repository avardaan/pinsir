// Mock Chrome extension APIs for tests
const storage: Record<string, any> = {};
const tabs: any[] = [];
const createdTabs: any[] = [];
const removedTabIds: number[] = [];

(globalThis as any).chrome = {
  storage: {
    sync: {
      get: async (keys: string[]) => {
        const result: Record<string, any> = {};
        for (const key of keys) {
          result[key] = storage[key];
        }
        return result;
      },
      set: async (items: Record<string, any>) => {
        Object.assign(storage, items);
      },
    },
  },
  tabs: {
    query: async (queryInfo: any) => {
      if (queryInfo.pinned) {
        return tabs.filter((t) => t.pinned && (!queryInfo.currentWindow || t.currentWindow));
      }
      return [];
    },
    create: async (createProperties: any) => {
      createdTabs.push(createProperties);
      return createProperties;
    },
    remove: async (tabIds: number | number[]) => {
      const ids = Array.isArray(tabIds) ? tabIds : [tabIds];
      removedTabIds.push(...ids);
    },
  },
};

export function resetMocks() {
  Object.keys(storage).forEach((k) => delete storage[k]);
  tabs.length = 0;
  createdTabs.length = 0;
  removedTabIds.length = 0;
}

export function getStorage() {
  return storage;
}

export function getCreatedTabs() {
  return createdTabs;
}

export function getRemovedTabIds() {
  return removedTabIds;
}

export function addMockTab(tab: any) {
  tabs.push(tab);
}
