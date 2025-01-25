import {brands, statuses} from '../enums/Lists'


  
export function validatorBoolean(value:any) {
  if (value === "true" || value === "false") {
    return typeof Boolean(value) === 'boolean'
  } else if (typeof value === 'boolean') {
    return true
  } else {
    return false
  }
}
export function validatorNumber(value:any) {
  return typeof value === 'number' && !isNaN(value) || /^(?!^\.)(?!^\.$)-?(0|[1-9]\d*)(\.\d+)?$/g.test(String(value));
}
export function validatorDate(value: string) {
  // Регулярное выражение для проверки формата YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!value.match(regex)) {
      return false;
  }

  // Разделим строку на части
  const parts = value.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Месяц в JavaScript начинается с 0
  const day = parseInt(parts[2]);

  // Создадим новый объект Date
  const date = new Date(year, month, day);

  // Проверим, соответствуют ли введённые данные реальной дате
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

export function validatorByCostField(value: string) {
  ///^(0|[1-9]\d*)(\.[0-9]{1,2})?$/.test(value) - будет не более 2х числа после запятой, нельзя отриц. числа
  ///^-?(0|[1-9]\d*)(\.[0-9]{1,4})?$/.test(value) - разрешаем 4 числа после запятой и отриц. числа
  //-? - разрешил отриц числа
  if (/^-?(0|[1-9]\d*)(\.[0-9]{1,2})?$/.test(value)) {
    return true
  } 

  return false
}

export function validatorByBrandField(value: string) {

  if (brands.some((el: string) => el === value)) {
    return true
  }

  return false
}

export function validatorByStatusField(value: string) {

  if (statuses.some((el: string) => el === value)) {
    return true
  }

  return false
}
