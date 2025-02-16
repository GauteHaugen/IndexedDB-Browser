import { FilterObject, type IFilterObjectOptions } from './filterObject';

export interface IFilterExpressionOptions extends IFilterObjectOptions {
  property: string;
  dataType: DataType;
  operator: Operator;
  value: any;
}

export type DataType = 'string' | 'number' | 'boolean' | 'datetime' | 'date' | 'time' | 'array' | 'object';
export type Operator = 'equals' | 'contains' | 'is-null' | 'is-not-null' | 'is-true' | 'is-false';

export class FilterExpression extends FilterObject {
  public readonly property: string;
  public dataType: DataType;
  public operator: Operator;
  public value: any;

  constructor(options: IFilterExpressionOptions) {
    super(options);

    this.property = options.property;
    this.dataType = options.dataType;
    this.operator = options.operator;
  }

  public filterRecords<T>(records: Array<T>): Array<T> {
    return records.filter((record) => this.filterRecord(record));
  }

  public filterRecord<T>(record: T): boolean {
    switch (this.dataType) {
      case 'boolean':
        return this.filterRecordBoolean(record);
    }

    return false;
  }

  public filterRecordValue(record: any): any | null {
    if (typeof record === 'object' && record.hasOwnProperty(this.property)) {
      return record[this.property];
    }

    return null;
  }

  public filterRecordBoolean<T>(record: T): boolean {
    const value = this.filterRecordValue(record);

    switch (this.operator) {
      case 'is-true':
        return this.filterValueIsTrue(value);
      case 'is-false':
        return this.filterValueIsFalse(value);
      case 'is-null':
        return this.filterValueIsNull(value);
      case 'is-not-null':
        return this.filterValueIsNotNull(value);
    }

    return false;
  }

  public filterValueIsTrue(value: any) {
    switch (typeof value) {
      case 'boolean':
        return value === true;
      case 'string':
        return value.toLowerCase() === 'true' || value === '1';
      case 'number':
        return value === 1;
    }

    return false;
  }

  public filterValueIsFalse(value: any) {
    switch (typeof value) {
      case 'boolean':
        return value === false;
      case 'string':
        return value.toLowerCase() === 'false' || value === '0';
      case 'number':
        return value === 0;
    }

    return false;
  }

  public filterValueIsNull(value: any) {
    return value === undefined || value === null;
  }

  public filterValueIsNotNull(value: any) {
    return this.filterValueIsNull(value) === false;
  }
}
