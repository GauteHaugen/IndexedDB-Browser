import { reactive } from 'vue';
import { IndexedDB } from './models/indexed_db';
import type { Database } from './models/database';
import type { ObjectStore } from './models/object_store';
import type { Index } from './models';

export interface IStore {
  state: IState;
  initialize: () => Promise<void>;
  refreshDatabases: () => Promise<void>;
  applyFilter: (search: string | null) => void;
  navigateToDatabase: (database: Database) => Promise<void>;
  navigateToObjectStore: (objectStore: ObjectStore) => Promise<void>;
  navigateToIndex: (index: Index) => Promise<void>;
}

export interface IState {
  indexedDB: IndexedDB;
  registerSearch: string | null;
  currentRoute: IRouteInformation;
  loadingRegister: boolean;
  loadingDetail: boolean;
}

export type IRouteInformation =
  | {
      type: 'welcome';
    }
  | {
      type: 'database';
      databaseName: string;
    }
  | {
      type: 'objectStore';
      databaseName: string;
      objectStoreName: string;
    }
  | {
      type: 'index';
      databaseName: string;
      objectStoreName: string;
      indexName: string;
    };

const state = reactive<IState>({
  indexedDB: new IndexedDB(),
  registerSearch: null,
  currentRoute: {
    type: 'welcome',
  },
  loadingRegister: false,
  loadingDetail: false,
});

async function initialize() {
  refreshDatabases();
}

function navigateToWelcome() {
  state.currentRoute = {
    type: 'welcome',
  };
}

async function navigateToDatabase(database: Database) {
  state.currentRoute = {
    type: 'database',
    databaseName: database.name,
  };
}

async function navigateToObjectStore(objectStore: ObjectStore) {
  state.currentRoute = {
    type: 'objectStore',
    databaseName: objectStore.database.name,
    objectStoreName: objectStore.name,
  };
}

async function navigateToIndex(index: Index) {
  state.currentRoute = {
    type: 'index',
    databaseName: index.database.name,
    objectStoreName: index.objectStore.name,
    indexName: index.name,
  };
}

async function refreshDatabases() {
  try {
    state.loadingRegister = true;
    state.loadingDetail = true;

    await state.indexedDB.getDatabases();

    applyFilter(state.registerSearch);

    navigateToWelcome();
  } finally {
    state.loadingRegister = false;
    state.loadingDetail = false;
  }
}

function applyFilter(search: string | null) {
  if (search === null || search.trim().length === 0) {
    state.registerSearch = null;
  } else {
    state.registerSearch = search.trim().toLowerCase();
  }

  state.indexedDB.applyFilter(state.registerSearch);
}

export const store = <IStore>{
  state,
  initialize,
  refreshDatabases,
  applyFilter,
  navigateToDatabase,
  navigateToObjectStore,
  navigateToIndex,
};
