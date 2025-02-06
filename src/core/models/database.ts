export class Database {
  public readonly name: string
  public readonly version: number

  get objectStores() {
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

  constructor(name: string, version: number) {
    this.name = name
    this.version = version
  }
}
