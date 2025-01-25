export enum EnumEmptyString {
  EmptyString = 'Пустые строки',
  EmptyStringValue = ''
}

export enum EnumTypeFieldByValue {
  Default = 'Default',
  Cost = 'Cost'
}  

export enum EnumTypeValueRus {
  string = 'строка',
  number = 'число',
  undefined = 'тип неопредлен'
}

export enum EnumTypeValueEng {
  string = 'string',
  number = 'number',
  undefined = 'тип неопредлен'
}

export enum EnumMouseClick {
  Right = 2,
  Left = 0
}

export enum EnumConditionRule {
  AND = 'И',
  OR = 'ИЛИ'
}

export function getEnumKeys<T>(enumType: any): Array<string> {
  return Object.keys(enumType) as Array<keyof T & string>;
}

export function getEnumStringValues<E extends Record<string, string>>(e: E): string[] {
  const values = Object.values(e);
  return values as string[];
}