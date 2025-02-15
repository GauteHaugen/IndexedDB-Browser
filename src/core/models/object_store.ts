import type { Database } from '@/core/models/database';
import type { Index } from '@/core/models/index';

export class ObjectStore {
  private readonly _indexes = new Map<string, Index>();
  private readonly _filteredIndexes = new Map<string, Index>();

  public readonly name: string;
  public readonly keyPath: string | string[];
  public readonly database: Database;

  public readonly propertySet = new Set<string>();

  public get loadedIndexes() {
    return this._indexes;
  }

  public get filteredIndexes() {
    return this._filteredIndexes;
  }

  constructor(name: string, keyPath: string | string[], database: Database) {
    this.name = name;
    this.keyPath = keyPath;
    this.database = database;

    this.retrieveObjectStoreProperties();
  }

  public applyFilter(search: string | null) {
    this._filteredIndexes.clear();

    let indexes = Array.from(this.loadedIndexes.values());

    if (search) {
      indexes = indexes.filter((index) => index.matchSearch(search));
    }

    for (const index of indexes) {
      this._filteredIndexes.set(index.name, index);
    }
  }

  public matchSearch(search: string) {
    if (this.name.toLowerCase().includes(search)) {
      return true;
    }

    const indexes = Array.from(this.loadedIndexes.values());

    if (indexes.some((index) => index.matchSearch(search))) {
      return true;
    }

    return false;
  }

  public async retrieveObjectStoreProperties(): Promise<Set<string>> {
    console.log('fetching properties');

    this.propertySet.clear();

    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);

    const cursorRequest = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = (event) => {
        console.log('fetching properties - Cursor success');

        const cursor = event.target.result;

        if (cursor) {
          const value = cursor.value;

          for (const key of Object.keys(value)) {
            this.propertySet.add(key);
          }

          cursor.continue();
        } else {
          resolve(this.propertySet);
        }
      };

      cursorRequest.onerror = (event) => {
        console.log('fetching properties - Cursor error');
        console.error(event);
        reject(event.target.result);
      };
    });
  }

  public async rowCount(): Promise<number> {
    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);

    return new Promise((resolve, reject) => {
      const request = objectStore.count();

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async retrieve(): Promise<Array<unknown>> {
    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);

    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}
