export enum EnumEmptyString {
    EmptyString = 'Пустые строки',
    EmptyStringValue = ''
}

export interface ISearchByColumnMetadata {
    value: string,
    column: number | null,
    fieldName: string | null
}