import { Database } from './database';

export class IndexedDB {
  private readonly _databases: Map<string, Database> = new Map();

  public async getDatabases(): Promise<Array<Database>> {
    this._databases.clear();

    const databases = await indexedDB.databases();

    const databasesArray = databases
      .map((indexedDatabase) => {
        const { name, version } = indexedDatabase;

        if (name === undefined || version === undefined) {
          console.warn('Indexed DB Manager:: Database name or version is undefined', indexedDatabase);
          return;
        }

        const database = new Database(name, version);

        this._databases.set(name, database);

        return database;
      })
      .filter((database) => database !== undefined);

    return databasesArray;
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
