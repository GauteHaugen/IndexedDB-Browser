import type { IDatabase } from './database';

export interface IObjectStore {
  readonly name: string;
  readonly keyPath: string | string[];
  readonly database: IDatabase;

  rowCount(): Promise<number>;
  retrieve(): Promise<Array<unknown>>;
}

export class ObjectStore implements IObjectStore {
  public readonly name: string;
  public readonly keyPath: string | string[];
  public readonly database: IDatabase;

  constructor(name: string, keyPath: string | string[], database: IDatabase) {
    this.name = name;
    this.keyPath = keyPath;
    this.database = database;
  }

  public async retrieveObjectStorePropterties(): Promise<Set<string>> {
    const db = await this.database.openDb();

    const transaction = db.transaction(this.name, 'readonly');
    const objectStore = transaction.objectStore(this.name);

    const cursor = objectStore.openCursor();

    const propertySet = new Set<string>();

    return new Promise((resolve, reject) => {
      cursor.onsuccess = () => {

      };

      cursor.onerror = () => {
        reject(cursor.error);
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
