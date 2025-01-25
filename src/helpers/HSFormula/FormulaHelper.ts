import {reactive, ref} from 'vue'
import {EnumNameField,EnumTypeField, EnumNamesFormula, EnumNamesEngFormula, EnumCategoriesRusFormula} from '../../enums/EnumsHSFormula'
import {IFormula} from './Types'

export const mathOperators = [';','(','=','{','*','+','-','/','}','&','^','%','>','<',')','[',']']
export const mathOperatorsForRange = [';', ':','(','=','{','*','+','-','/','&','^','%','>','<','[']

export const formulaMap = reactive<Map<EnumNamesFormula | string, IFormula>> (new Map([
    
        [
            EnumNamesFormula.TEST,
            {
                nameEng: EnumNamesEngFormula.TEST,
                nameRus:  EnumNamesFormula.TEST,
                category: EnumCategoriesRusFormula.Инженерные,
                description: 'TEST'
            }
        ],
        [
            EnumNamesFormula.ЕСЛИ,
            {
                nameEng: EnumNamesEngFormula.IF,
                nameRus:  EnumNamesFormula.ЕСЛИ,
                category: EnumCategoriesRusFormula.Логические,
                description: 'Возвращает различные значения в зависимости от результата логической проверки (TRUE или FALSE)',
            }
        ],

        [
            EnumNamesFormula.И,
            {
                nameEng: EnumNamesEngFormula.AND,
                nameRus:  EnumNamesFormula.И,
                category: EnumCategoriesRusFormula.Логические,
                description: 'Логический оператор AND',
            }
        ],
        [
            EnumNamesFormula.ИЛИ,
            {
                nameEng: EnumNamesEngFormula.OR,
                nameRus:  EnumNamesFormula.ИЛИ,
                category: EnumCategoriesRusFormula.Логические,
                description: 'Логический оператор OR',
            }
        ],
        [
            EnumNamesFormula.НЕ,
            {
                nameEng: EnumNamesEngFormula.NOT,
                nameRus:  EnumNamesFormula.НЕ,
                category: EnumCategoriesRusFormula.Логические,
                description: 'Значение, противоположное указанному',
            }
        ],
        [
            EnumNamesFormula.ИСТИНА,
            {
                nameEng: EnumNamesEngFormula.TRUE,
                nameRus:  EnumNamesFormula.ИСТИНА,
                category: EnumCategoriesRusFormula.Логические,
                description: 'Возвращает логическое значение TRUE (истина)',
            }
        ],
        [
            EnumNamesFormula.ЛОЖЬ,
            {
                nameEng: EnumNamesEngFormula.FALSE,
                nameRus:  EnumNamesFormula.ЛОЖЬ,
                category: EnumCategoriesRusFormula.Логические,
                description: 'Возвращает логическое значение FALSE (ложь)',
            }
        ],
        [
            EnumNamesFormula.МИН,
            {
                nameEng: EnumNamesEngFormula.MIN,
                nameRus:  EnumNamesFormula.МИН,
                category: EnumCategoriesRusFormula.Статистические,
                description: 'Возвращает минимальное значение в наборе чисел',
            }
        ],
        [
            EnumNamesFormula.МАКС,
            {
                nameEng: EnumNamesEngFormula.MAX,
                nameRus:  EnumNamesFormula.МАКС,
                category: EnumCategoriesRusFormula.Статистические,
                description: 'Возвращает максимальное значение в наборе чисел',
            }
        ],
        [
            EnumNamesFormula.СРЗНАЧ,
            {
                nameEng: EnumNamesEngFormula.AVERAGE,
                nameRus:  EnumNamesFormula.СРЗНАЧ,
                category: EnumCategoriesRusFormula.Статистические,
                description: 'Вычисляет среднее арифметическое аргументов (за исключением текстовых)',
            }
        ],
        [
            EnumNamesFormula.ABS,
            {
                nameEng: EnumNamesEngFormula.ABS,
                nameRus:  EnumNamesFormula.ABS,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Возвращает модуль (абсолютную величину) числа',
            }
        ],
        [
            EnumNamesFormula.СУММ,
            {
                nameEng: EnumNamesEngFormula.SUM,
                nameRus:  EnumNamesFormula.СУММ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Суммирует аргументы'
            },
        ],
        [EnumNamesFormula.ПРОИЗВЕД,
            {
                nameEng: EnumNamesEngFormula.PRODUCT,
                nameRus:  EnumNamesFormula.ПРОИЗВЕД,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Возвращает произведение аргументов'
            }
        ],
        [
            EnumNamesFormula.ЧАСТНОЕ,
            {
                nameEng: EnumNamesEngFormula.QUOTIENT,
                nameRus:  EnumNamesFormula.ЧАСТНОЕ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Возвращает целую часть результата деления с остатком'
            }
        ],
        [
            EnumNamesFormula.СУММЕСЛИ,
            {
                nameEng: EnumNamesEngFormula.SUMIF,
                nameRus:  EnumNamesFormula.СУММЕСЛИ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Суммирует ячейки, заданные указанным условием'
            }
        ],
        [
            EnumNamesFormula.ОКРУГЛ,
            {
                nameEng: EnumNamesEngFormula.ROUND,
                nameRus:  EnumNamesFormula.ОКРУГЛ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Округляет число до указанного количества десятичных знаков'
            }
        ],
        [
            EnumNamesFormula.ОКРУГЛВВЕРХ,
            {
                nameEng: EnumNamesEngFormula.ROUNDUP,
                nameRus:  EnumNamesFormula.ОКРУГЛВВЕРХ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Округляет число до ближайшего большего по модулю'
            }
        ],
        [
            EnumNamesFormula.ОКРУГЛВНИЗ,
            {
                nameEng: EnumNamesEngFormula.ROUNDDOWN,
                nameRus:  EnumNamesFormula.ОКРУГЛВНИЗ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Округляет число до ближайшего меньшего по модулю'
            }
        ],
        [
            EnumNamesFormula.СТЕПЕНЬ,
            {
                nameEng: EnumNamesEngFormula.POWER,
                nameRus:  EnumNamesFormula.СТЕПЕНЬ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Возвращает результат возведения в степень'
            }
        ],
        [
            EnumNamesFormula.ОТБР,
            {
                nameEng: EnumNamesEngFormula.TRUNC,
                nameRus:  EnumNamesFormula.ОТБР,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Отбрасывает дробную часть числа, так что остается целое число'
            }
        ],
        [
            EnumNamesFormula.ЦЕЛОЕ,
            {
                nameEng: EnumNamesEngFormula.INT,
                nameRus:  EnumNamesFormula.ЦЕЛОЕ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Округляет число до ближайшего меньшего целого'
            }
        ],
        [
            EnumNamesFormula.КОРЕНЬ,
            {
                nameEng: EnumNamesEngFormula.SQRT,
                nameRus:  EnumNamesFormula.КОРЕНЬ,
                category: EnumCategoriesRusFormula.Математические,
                description: 'Возвращает значение квадратного корня'
            }
        ],
        [
            EnumNamesFormula.СЧЁТ,
            {
                nameEng: EnumNamesEngFormula.COUNT,
                nameRus:  EnumNamesFormula.СЧЁТ,
                category: EnumCategoriesRusFormula.Статистические,
                description: 'Количество числовых значений в наборе данных',
            }
        ],

        //Текстовые
        [
            EnumNamesFormula.ДЛСТР,
            {
                nameEng: EnumNamesEngFormula.LEN,
                nameRus:  EnumNamesFormula.ДЛСТР ,
                category: EnumCategoriesRusFormula.Текстовые,
                description: 'Длина строки'
            },
        ],
        [
            EnumNamesFormula.ПРАВСИМВ,
            {
                nameEng: EnumNamesEngFormula.RIGHT,
                nameRus:  EnumNamesFormula.ПРАВСИМВ ,
                category: EnumCategoriesRusFormula.Текстовые,
                description: 'Отрезок текста с конца строки'
            },
        ],
        [
            EnumNamesFormula.ЛЕВСИМВ,
            {
                nameEng: EnumNamesEngFormula.LEFT,
                nameRus:  EnumNamesFormula.ЛЕВСИМВ ,
                category: EnumCategoriesRusFormula.Текстовые,
                description: 'Отрезок текста с начала строки'
            },
        ],
	]
))