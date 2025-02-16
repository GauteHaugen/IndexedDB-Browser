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
    this.propertySet.clear();

    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);

    const cursorRequest = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = (event) => {
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

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public async retrievePage(pageOffset: number = 0, pageSize: number = 25): Promise<Array<unknown>> {
    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);
    const cursorRequest = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      const result = new Array<any>();

      let advanced = false;

      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor === null) {
          resolve(result);
          return;
        }

        if (advanced === false && pageOffset > 0) {
          cursor.advance(pageOffset * pageSize);
          advanced = true;
          return;
        }

        result.push(cursor.value);

        if (result.length < pageSize) {
          cursor.continue();
          return;
        }

        resolve(result);
      };

      cursorRequest.onerror = (event) => {
        reject(event.target.result);
      };
    });
  }

  public async retrieveDistinctValues(property: string) {
    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);
    const cursorRequest = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      const result = new Map<string, number>();

      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor === null) {
          resolve(result);
          return;
        }

        const row = cursor.value;
        const value = row[property]?.toString() ?? 'NULL';
        const count = result.get(value) ?? 0;

        result.set(value, count + 1);

        cursor.continue();
      };

      cursorRequest.onerror = (event) => {
        reject(event.target.result);
      };
    });
  }
}
