declare global {
  interface IDBRequestEvent<T = any> extends Event {
    readonly target: EventTarget & { result: T };
  }

  interface ExtendedIDBRequest<OnSuccessType, OnErrorType> extends IDBRequest {
    onsuccess: ((this: ExtendedIDBRequest<OnSuccessType>, event: IDBRequestEvent<OnSuccessType>) => any) | null;
    onerror: ((this: ExtendedIDBRequest<OnErrorType>, event: IDBRequestEvent<OnErrorType>) => any) | null;
  }

  interface IDBObjectStore {
    openCursor(
      range?: IDBKeyRange | IDBValidKey | null,
      direction?: IDBCursorDirection,
    ): ExtendedIDBRequest<IDBCursorWithValue | null, any | null>;
  }
}

export {};
