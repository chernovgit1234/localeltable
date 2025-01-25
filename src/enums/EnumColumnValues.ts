
export enum EnumTypeBrand {
  'brand' = 'Группа',
  'product' = 'Запчасть',
}

export enum EnumTypeBrandRow {
  'brand' = 'brand',
  'product' = 'product'
}

export function getFieldNameByColumnNum(col: number): string {

  let returnValue= ''

  switch (col) {
    case EnumColumnTableNumber.Type:
      returnValue = EnumFieldName.Type
      break
    case EnumColumnTableNumber.Name:
      returnValue = EnumFieldName.Name
      break
    case EnumColumnTableNumber.Brand:
      returnValue = EnumFieldName.Brand
      break
    case EnumColumnTableNumber.ProductionDate:
      returnValue = EnumFieldName.ProductionDate
      break
    case EnumColumnTableNumber.CostOne:
      returnValue = EnumFieldName.CostOne
      break
    case EnumColumnTableNumber.CostTwo:
      returnValue = EnumFieldName.CostTwo
      break
    case EnumColumnTableNumber.Percent:
      returnValue = EnumFieldName.Percent
      break
    case EnumColumnTableNumber.Present:
      returnValue = EnumFieldName.Present
      break
    case EnumColumnTableNumber.Status:
      returnValue = EnumFieldName.Status
      break
    case EnumColumnTableNumber.Comments:
      returnValue = EnumFieldName.Comments
      break
  }

  return returnValue

}

export enum EnumGroupColumnName {
  GroupColumn1 = 'Группа колонок 1',
  GroupColumn2 = 'Группа колонок 2',
  GroupColumn3 = 'Группа колонок 3',
}

export enum EnumColumnName {
  /* Guid = '', */
  Type = 'Тип',
  Name = 'Наименование',
  Brand = 'Брэнд',
  ProductionDate = 'Дата выпуска',
  CostOne = 'Стоимость первая',
  CostTwo = 'Стоимость вторая',
  Percent = 'Процент',
  Present = 'Наличие',
  Status = 'Статус',
  Comments = 'Комментарий'
}

export enum EnumColumnNameRange {
  /* Guid = 'GuidFake', */
  Type = 'ТИП',
  Name = 'НАИМЕНОВАНИЕ',
  Brand = 'БРЭНД',
  ProductionDate = 'ДАТАВЫПУСКА',
  CostOne = 'СТОИМОСТЬПЕРВАЯ',
  CostTwo = 'СТОИМОСТЬВТОРАЯ',
  Percent = 'ПРОЦЕНТ',
  Present = 'НАЛИЧИЕ',
  Status = 'СТАТУС',
  Comments = 'КОММЕНТАРИЙ'
}

/* export const listEnumColumnName = [
'','Тип','Наименование','Брэнд','Дата выпуска','Стоимость первая','Стоимость вторая','Процент','Наличие','Статус','Комментарий'
] */
export const listEnumColumnName = [
  'Тип','Наименование','Брэнд','Дата выпуска','Стоимость первая','Стоимость вторая','Процент','Наличие','Статус','Комментарий'
  ]

export enum EnumFieldName {
 /*  Guid = 'Guid', */
  Type = 'TypeRow',
  Name = 'Name',
  Brand = 'Brand',
  ProductionDate = 'ProductionDate',
  CostOne = 'CostOne',
  CostTwo = 'CostTwo',
  Percent = 'Percent',
  Present = 'Present',
  Status = 'Status',
  Comments = 'Comments'
}

/* export enum EnumColumnNumber {
  Type = 0,
  Name = 1,
  Brand = 2,
  ProductionDate = 3,
  CostOne = 4,
  CostTwo = 5,
  Percent = 6,
  Present = 7,
  Status = 8,
  Comments = 9
}

export enum EnumColumnTableNumber {
  Numbs = -1,
  Guid = 0,
  Type = 1,
  Name = 2,
  Brand = 3,
  ProductionDate = 4,
  CostOne = 5,
  CostTwo = 6,
  Percent = 7,
  Present = 8,
  Status = 9,
  Comments = 10
} */

export enum EnumColumnNumber {
  Type = 0,
  Name = 1,
  Brand = 2,
  ProductionDate = 3,
  CostOne = 4,
  CostTwo = 5,
  Percent = 6,
  Present = 7,
  Status = 8,
  Comments = 9
}

export enum EnumColumnTableNumber {
  Numbs = -1,
  /* Guid = 0, */
  Type = 0,
  Name = 1,
  Brand = 2,
  ProductionDate = 3,
  CostOne = 4,
  CostTwo = 5,
  Percent = 6,
  Present = 7,
  Status = 8,
  Comments = 9
}

