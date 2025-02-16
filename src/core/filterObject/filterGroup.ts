import { FilterObject, type IFilterObjectOptions } from './filterObject';

export interface IFilterGroupOptions extends IFilterObjectOptions {
  filterObjects: Array<FilterObject>;
  type: FilterGroupType;
}

export type FilterGroupType = 'AND' | 'OR';

export class FilterGroup extends FilterObject {
  private readonly filterObjects: Array<FilterObject>;
  private type: FilterGroupType;

  constructor(options: IFilterGroupOptions) {
    super(options);

    this.filterObjects = options.filterObjects;
    this.type = options.type;
  }

  public getByIdInternal(id: string): FilterObject | null {
    for (let i = 0; i < this.filterObjects.length; i++) {
      const filterObject = this.filterObjects[i];

      if (filterObject.id === id) {
        return filterObject;
      }

      const filterObjectResult = filterObject.getByIdInternal(id);

      if (filterObjectResult) {
        return filterObjectResult;
      }
    }

    return super.getByIdInternal(id);
  }

  public addOrReplaceFilterObject(filterObject: FilterObject): void {
    if (filterObject.id === undefined) {
      this.filterObjects.push(filterObject);

      return;
    }

    const filterObjectLookup = this.getById(filterObject.id);

    if (filterObjectLookup === null) {
      this.filterObjects.push(filterObject);

      return;
    }

    this.replaceById(filterObject);
  }

  public replaceByIdInternal(filterObject: FilterObject): FilterObject | null {
    for (let i = 0; i < this.filterObjects.length; i++) {
      const oldFilterObject = this.filterObjects[i];

      if (oldFilterObject.id === filterObject.id) {
        this.filterObjects[i] = filterObject;

        return oldFilterObject;
      }

      const filterObjectResult = filterObject.replaceByIdInternal(filterObject);

      if (filterObjectResult) {
        return filterObjectResult;
      }
    }

    return super.replaceByIdInternal(filterObject);
  }

  public removeByIdInternal(id: string): FilterObject | null {
    for (let i = 0; i < this.filterObjects.length; i++) {
      const filterObject = this.filterObjects[i];

      if (filterObject.id === id) {
        this.filterObjects.splice(i, 1);

        return filterObject;
      }

      const filterObjectResult = filterObject.removeByIdInternal(id);

      if (filterObjectResult) {
        return filterObjectResult;
      }
    }

    return super.removeByIdInternal(id);
  }

  public filterRecords<T>(records: Array<T>): Array<T> {
    return records.filter((record) => this.filterRecord(record));
  }

  public filterRecord<T>(record: T): boolean {
    switch (this.type) {
      case 'AND':
        return this.filterObjects.every((filterObject) => filterObject.filterRecord(record));
      case 'OR':
        return this.filterObjects.some((filterObject) => filterObject.filterRecord(record));
    }
  }
}
