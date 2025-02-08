import { reactive, readonly, type DeepReadonly, type UnwrapNestedRefs } from 'vue';
import { IndexedDB } from './models/indexed_db';
import type { Database } from './models/database';

export interface IStore {
  state: DeepReadonly<UnwrapNestedRefs<IState>>;
  initialize: () => Promise<void>;
}

export interface IState {
  databases: Map<string, Database>;
}

const indexedDbHelper = new IndexedDB();
const state = reactive({
  databases: new Map<string, Database>(),
});

async function initialize() {
  await loadDatabases();
}

async function loadDatabases() {
  const databases = await indexedDbHelper.getDatabases();

  for (const database of databases) {
    state.databases.set(database.name, database);
  }
}

export const store = <IStore>{
  state: readonly(state),
  initialize: initialize,
};
