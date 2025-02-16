import { Database } from './database';

export class IndexedDB {
  private readonly _databases = new Map<string, Database>();
  private readonly _filteredDatabases = new Map<string, Database>();

  public get loadedDatabases() {
    return this._databases;
  }

  public get filteredDatabases() {
    return this._filteredDatabases;
  }

  public applyFilter(search: string | null) {
    this._filteredDatabases.clear();

    let databases = Array.from(this.loadedDatabases.values());

    if (search) {
      databases = databases.filter((database) => database.matchSearch(search));
    }

    for (const database of databases) {
      database.applyFilter(search);

      this._filteredDatabases.set(database.name, database);
    }
  }

  public async getDatabases(): Promise<void> {
    this._databases.clear();

    const databases = await indexedDB.databases();

    const databasesPromiseArray = databases
      .map(async (indexedDatabase) => {
        const { name, version } = indexedDatabase;

        if (name === undefined || version === undefined) {
          console.warn('Indexed DB Manager:: Database name or version is undefined', indexedDatabase);
          return;
        }

        const database = new Database(name, version);

        await database.getObjectStores();

        this._databases.set(name, database);

        return database;
      })
      .filter((database) => database !== undefined);

    await Promise.allSettled(databasesPromiseArray);
  }

  public async getDatabase(databaseName: string): Promise<Database | null> {
    let database = this._databases.get(databaseName);

    if (database !== undefined) {
      return database;
    }

    const indexedDatabases = await indexedDB.databases();

    for (const indexedDatabase of indexedDatabases) {
      const { name, version } = indexedDatabase;

      if (name === undefined || version === undefined) {
        console.warn('Indexed DB Manager:: Database name or version is undefined', database);

        continue;
      }

      if (name === databaseName) {
        database = new Database(name, version);

        this._databases.set(name, database);

        return database;
      }
    }

    return null;
  }
}
