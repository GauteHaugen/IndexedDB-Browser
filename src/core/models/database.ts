import { ObjectStore } from './object_store';

export class Database {
  private readonly _objectStores = new Map<string, ObjectStore>();
  private readonly _filteredObjectStores = new Map<string, ObjectStore>();

  private _database: IDBDatabase | null = null;
  private _databaseVersionOutdated: boolean = false;

  public readonly name: string;
  public readonly version: number;

  public get loadedObjectStores() {
    return this._objectStores;
  }

  public get filteredObjectStores() {
    return this._filteredObjectStores;
  }

  public get databaseVersionOutdated() {
    return this._databaseVersionOutdated;
  }

  constructor(name: string, version: number) {
    this.name = name;
    this.version = version;
  }

  public applyFilter(search: string | null) {
    console.log('Applying search ' + search);

    this._filteredObjectStores.clear();

    let objectStores = Array.from(this.loadedObjectStores.values());

    if (search) {
      objectStores = objectStores.filter((objectStore) => objectStore.matchSearch(search));
    }

    for (const objectStore of objectStores) {
      this._filteredObjectStores.set(objectStore.name, objectStore);
    }
  }

  public matchSearch(search: string) {
    if (this.name.toLowerCase().includes(search)) {
      return true;
    }

    const objectStores = Array.from(this.loadedObjectStores.values());

    if (objectStores.some((objectStore) => objectStore.matchSearch(search))) {
      return true;
    }

    return false;
  }

  public async getObjectStores(): Promise<Array<ObjectStore>> {
    const db = await this.openDb();

    this._objectStores.clear();

    const objectStores = Array.from(db.objectStoreNames).map((objectStoreName) => {
      const transaction = db.transaction(objectStoreName, 'readonly');

      const indexedObjectStore = transaction.objectStore(objectStoreName);

      const objectStore = new ObjectStore(indexedObjectStore.name, indexedObjectStore.keyPath, this);

      this._objectStores.set(objectStoreName, objectStore);

      return objectStore;
    });

    return objectStores;
  }

  public async getObjectStore(objectStoreName: string): Promise<ObjectStore | null> {
    let objectStore = this._objectStores.get(objectStoreName);

    if (objectStore !== undefined) {
      return objectStore;
    }

    const db = await this.openDb();

    if (!db.objectStoreNames.contains(objectStoreName)) {
      return null;
    }

    const transaction = db.transaction(objectStoreName, 'readonly');

    const indexedObjectStore = transaction.objectStore(objectStoreName);

    objectStore = new ObjectStore(indexedObjectStore.name, indexedObjectStore.keyPath, this);

    this._objectStores.set(objectStoreName, objectStore);

    return objectStore;
  }

  public async openDb(): Promise<IDBDatabase> {
    try {
      if (this._database !== null) {
        return this._database;
      }

      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const openDbRequest = indexedDB.open(this.name, this.version);

        openDbRequest.onblocked = (event) => {
          reject(event);
        };

        openDbRequest.onupgradeneeded = (event) => {
          reject(event);
        };

        openDbRequest.onerror = () => {
          reject(openDbRequest.error);
        };

        openDbRequest.onsuccess = () => {
          resolve(openDbRequest.result);
        };
      });

      this._database = database;

      database.onversionchange = () => {
        this._databaseVersionOutdated = true;
        this._database = null;

        database.close();
      };

      return database;
    } catch (reason) {
      if (reason instanceof Event) {
        this._databaseVersionOutdated = true;
      }

      throw reason;
    }
  }
}
