import type { Database } from './database';
import type { ObjectStore } from './object_store';

export class Index {
  public readonly name: string;
  public readonly database: Database;
  public readonly objectStore: ObjectStore;

  constructor(name: string, database: Database, objectStore: ObjectStore) {
    this.name = name;
    this.database = database;
    this.objectStore = objectStore;
  }

  public matchSearch(search: string) {
    if (this.name.toLowerCase().includes(search)) {
      return true;
    }

    return false;
  }
}
