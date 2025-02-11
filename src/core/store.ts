import { reactive, readonly, type DeepReadonly, type UnwrapNestedRefs } from 'vue';
import { IndexedDB } from './models/indexed_db';
import type { Database } from './models/database';
import type { ObjectStore } from './models/object_store';
import type { Index } from './models';

export interface IStore {
  state: DeepReadonly<UnwrapNestedRefs<IState>>;
  initialize: () => Promise<void>;
  navigateToDatabase: (database: Database) => Promise<void>;
  navigateToObjectStore: (objectStore: ObjectStore) => Promise<void>;
  navigateToIndex: (index: Index) => Promise<void>;
}

export interface IState {
  databases: Map<string, Database>;
  currentRoute: IRouteInformation;
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

const indexedDbHelper = new IndexedDB();
const state = reactive<IState>({
  databases: new Map<string, Database>(),
  currentRoute: {
    type: 'welcome',
  },
});

async function initialize() {
  await loadDatabases();
}

async function loadDatabases() {
  const databases = await indexedDbHelper.getDatabases();

  for (const database of databases) {
    /* const objectStores = */ await database.getObjectStores();

    // for (const objectStore of objectStores) {
    // TODO: Add method to load indexes
    // }

    state.databases.set(database.name, database);
  }
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

export const store = <IStore>{
  state: readonly(state),
  initialize,
  navigateToDatabase,
  navigateToObjectStore,
  navigateToIndex,
};
