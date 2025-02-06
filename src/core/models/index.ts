import type { Database } from './database'
import type { ObjectStore } from './object_store'

export class Index {
  public readonly name: string
  public readonly database: Database
  public readonly objectStore: ObjectStore

  get indexes() {
    return new Proxy(
      {
        getAll: async () => {},
      },
      {
        get: (target, prop, receiver) => {
          if (prop in target) {
            return Reflect.get(target, prop, receiver)
          }

          return new Promise(async (resolve, reject) => {
            const openDbRequest = indexedDB.open(this.name)

            openDbRequest.onsuccess = () => {
              const db = openDbRequest.result

              const objectStores = db.objectStoreNames

              resolve(objectStores)
            }

            openDbRequest.onerror = () => {
              reject(openDbRequest.error)
            }
          })
        },
      },
    )
  }

  constructor(name: string, database: Database, objectStore: ObjectStore) {
    this.name = name
    this.database = database
    this.objectStore = objectStore
  }
}
