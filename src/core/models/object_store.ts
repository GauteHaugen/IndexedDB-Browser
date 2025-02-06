import type { Database } from './database'

export class ObjectStore {
  public readonly name: string
  public readonly keyPath: string | string[]
  public readonly database: Database

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

  constructor(name: string, keyPath: string | string[], database: Database) {
    this.name = name
    this.keyPath = keyPath
    this.database = database
  }
}
