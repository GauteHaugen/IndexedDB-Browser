import type { Database } from '@/core/models/database';

export class ObjectStore {
  public readonly name: string;
  public readonly keyPath: string | string[];
  public readonly database: Database;

  constructor(name: string, keyPath: string | string[], database: Database) {
    this.name = name;
    this.keyPath = keyPath;
    this.database = database;
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
