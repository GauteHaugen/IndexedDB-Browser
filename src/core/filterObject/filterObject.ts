export interface IFilterObjectOptions {
  id?: string;
  parent?: FilterObject;
}

export abstract class FilterObject {
  public readonly id?: string;
  public parent?: FilterObject;

  constructor(options: IFilterObjectOptions) {
    this.id = options.id;
    this.parent = options.parent;
  }

  public getById(id: string): FilterObject | null {
    if (this.parent) {
      return this.getById(id);
    }

    return this.getByIdInternal(id);
  }

  public getByIdInternal(id: string): FilterObject | null {
    return this.id === id ? this : null;
  }

  public removeById(id: string): FilterObject | null {
    if (this.parent) {
      return this.removeById(id);
    }

    return this.removeByIdInternal(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public removeByIdInternal(id: string): FilterObject | null {
    return null;
  }

  public replaceById(filterObject: FilterObject): FilterObject | null {
    if (this.parent) {
      return this.replaceById(filterObject);
    }

    return this.replaceByIdInternal(filterObject);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public replaceByIdInternal(filterObject: FilterObject): FilterObject | null {
    return null;
  }

  abstract filterRecords<T>(records: Array<T>): Array<T>;
  abstract filterRecord<T>(record: T): boolean;
}
