<style lang="scss">

.create-formula {
    background-color: #fff;
    min-width: 800px;
    max-height: 90%;
    min-height: 60%;
    gap: 20px;
    display: flex;
    flex-direction: column;

    &__content {
        font-family: Roboto400;
        min-height: 400px;
        min-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    &__select {
        width: 300px;
        background-color: #fff !important;
    }

    &__actions {
    }
}
.content-create-formula {
    &__selects {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        display: grid;
        grid-template-columns: 50% 50%;
    }

    &__description {
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
    }

    &__create-section {
        border: 1px solid var(--grey-border-color);
    }
}

.create-section-formula {
    padding: 5px;
    width: 100%;
    height: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__desc {
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
    }

    &__list {
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__result {
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        display: grid;
        grid-template-columns: 60% auto;
        
    }

    &__row {
        display: grid;
        grid-template-columns: 60% auto;
        padding: 0 5px;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
        gap: 10px;
    }

    &__row-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    &__row-right {
        display: flex;
        align-items: center;
        white-space: nowrap; /* Текст не переносится */
        overflow: hidden; /* Обрезаем всё за пределами блока */
        text-overflow: ellipsis; /* Добавляем многоточие */
    }

    &__body-input {
        position: relative;
        display: flex;
        flex-direction: row;
    }
    &__btn {
        position: absolute;
        width: 25px;
        height: 25px;
        right: 0;
        display: grid;
        place-items: center;
        cursor: pointer;
        color: #1C274C;
        &::after {
            content: '\25A6' !important;
            font-size: 16px !important;
        }

        &:hover {
            background-color: var(--ligth-grey-color);
        }
        
    }

    &__input {

        font-size: 12px;
        height: 25px;
        /* width: 500px; */
        width: 400px;
        padding: 5px 30px 5px 8px;
        /* border:  1px solid var(--grey-border-color); */
        
        /* &:hover {
            border:  1px solid black;
            transition: all 0.3s ease 0s;
        } */
    }

    &__input-range {

        font-size: 14px;
        height: 25px;
        width: 200px;
        padding: 2px 8px;
        border:  1px solid var(--border-input-color);

        &:hover {
            border:  1px solid black;
            transition: all 0.3s ease 0s;
        }
    }    

    &__pre-text {

    }

    &__post-text {
        white-space: nowrap; /* Текст не переносится */
        overflow: hidden; /* Обрезаем всё за пределами блока */
        text-overflow: ellipsis; /* Добавляем многоточие */
    }
}
</style>

<template>
    <div class="create-formula">
        <div class="create-formula__content content-create-formula">
            <div class="content-create-formula__selects">
                <q-select 
                    square 
                    outlined  
                    dense 
                    class="create-formula__select"  
                    v-model="modelSelectedCategory" 
                    :options="categoriesFormula" 
                    label="Категория функций" 
                >
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" dense>
                            <q-item-section>
                                <q-item-label>{{ scope.opt }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
                <q-select
                    class="create-formula__select"
                    square
                    label="Функция"
                    options-cover
                    dense
                    v-model="modelSelectedFunction"
                    use-input
                    input-debounce="5"
                    outlined 
                    @filter="filterFnFormula"
                    :options="functionsFormulaList"
                >
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section>
                                Ничего не найдено
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" dense>
                            <q-item-section>
                                <q-item-label>{{ scope.opt }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-if="modelSelectedFunction" v-slot:append>
                        <q-icon  name="cancel" @click.stop="clearSelectedFormula()" class="cursor-pointer" />
                    </template>
                </q-select>
            </div>
            <div class="content-create-formula__description">
                <span>{{ maskDescriptionFunction }}.</span> <span>{{ descriptionFunction }}</span>
            </div>
            <div class="content-create-formula__create-section create-section-formula">
                <div class="create-section-formula__desc">
                    <span>Функция:</span> <span class="text-bold">{{ modelSelectedFunction }}</span>
                </div>
                <div class="create-section-formula__list">
                    <div class="create-section-formula__row" v-for="(field, i) in fieldsConfigList" :key="i">
                        <div class="create-section-formula__row-left">
                            <span class="create-section-formula__pre-text">{{ field.name }}</span>
                            <div class="create-section-formula__body-input">
                                <input 
                                    @focus="focusInput(field)" 
                                    :style="{'border': field.focusedInput === true ? '1px solid black' : '1px solid var(--grey-border-color)'}" 
                                    class="create-section-formula__input" 
                                    type="text" 
                                    v-model="field.valueInput"
                                    @input="inputInput(field)"
                                    :title="field.valueInput"
                                />
                                <!-- <span class="create-section-formula__btn"></span> -->
                            </div>
                            <!-- <div class="create-section-formula__body-input-range">
                                <input class="create-section-formula__input-range" type="text" />
                            </div> -->
                        </div>
                        <div class="create-section-formula__row-right">
                            <span class="create-section-formula__post-text">= {{field.result}}</span>
                            <q-tooltip class="custom-tooltip" >
                                <span class="cursor-carret_none">{{field.result}}</span><br/>
                            </q-tooltip>
                        </div>
                        
                    </div>
                </div>
                <div class="create-section-formula__result">
                    <span>Результат:</span> <span class="text-bold">ggg</span>
                </div>
            </div>
        </div>
        <div class="create-formula__actions">
            <button class="btn" @click.stop>Вставить</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits , toRaw, reactive} from 'vue';
import {formulaMap} from '../../helpers/HSFormula/FormulaHelper'
import {IFormula} from '../../helpers/HSFormula/Types'
import {categoriesFormulaList} from '../../helpers/HSFormula/FunctionsList'
import {EnumCategoriesRusFormula} from '../../enums/EnumsHSFormula'
import { useStore } from 'vuex'
import {EnumNamesFormula, EnumNameField, EnumTypeField} from '../../enums/EnumsHSFormula'
import {IConfiguration, IFieldConfigurationLocal, IFieldConfiguration} from '../../helpers/HSFormula/Types'

const store = useStore()

function focusInput(field: IFieldConfigurationLocal) {
    fieldsConfigList.value.forEach((fieldLocal: IFieldConfigurationLocal) => fieldLocal.focusedInput = false)
    field.focusedInput = true
}
function inputInput(field: IFieldConfigurationLocal) {
    //console.log('inputInput valueInput', field.valueInput)
    console.log('fieldsConfigList', field.valueInput)

}

const emit = defineEmits(['closeDialog'])

const categoriesFormula = [...categoriesFormulaList] as string[] 
const optionsFormula = [...formulaMap.keys()] as string[]

let functionsFormulaList = ref<string[]>(optionsFormula)

let modelSelectedCategory = ref<string>(EnumCategoriesRusFormula.Все)
let modelSelectedFunction = ref<string>()

let maskDescriptionFunction = ref<string>()
let descriptionFunction = ref<string>()
let fixConfigList = ref<boolean>(true)
let fieldsConfigList = ref<IFieldConfigurationLocal[]>([])

const highlightedRangeCells = computed(() => {
    return store.getters.highlightedRangeCells
})
const dataByHighlightedRangeCells = computed(() => {
    return store.getters.dataByHighlightedRangeCells
})

watch(highlightedRangeCells, (newValue: string) => {
    let findField: IFieldConfigurationLocal = fieldsConfigList.value.find((field: IFieldConfigurationLocal) => field.focusedInput === true) as IFieldConfigurationLocal
    if (findField) {
        findField.valueInput = newValue
    }
    //console.log('findField', findField)
})
watch(dataByHighlightedRangeCells, (newValue: any) => {
    let findField: IFieldConfigurationLocal = fieldsConfigList.value.find((field: IFieldConfigurationLocal) => field.focusedInput === true) as IFieldConfigurationLocal
    if (findField) {
        findField.result = newValue.flat()
    }
    //console.log('newValuedataByHighlightedRangeCells', newValue.flat())
})
function clearSelectedFormula() {
    modelSelectedFunction.value = ''
    updateFunctionsFormulaList(modelSelectedCategory.value)
}

function updateFunctionsFormulaList(filterValue: string) {
    if (filterValue === EnumCategoriesRusFormula.Все) {
        functionsFormulaList.value = [...formulaMap.keys()] as string[]
    } else {
        functionsFormulaList.value = ([...formulaMap.values() ] as IFormula[]).filter((itemFormula: IFormula) => itemFormula.category === filterValue).map((itemFormula: IFormula) => itemFormula.nameRus)
    }
}

watch(modelSelectedCategory, (filterValue: string) => {
    updateFunctionsFormulaList(filterValue)
})

watch(modelSelectedFunction, (func: any) => {
    if (func) {
        const functionObject: IFormula =  formulaMap.get(func as EnumNamesFormula) as IFormula
        maskDescriptionFunction.value = functionObject.maskDescription
        descriptionFunction.value = functionObject.description
        /* fixConfigList.value = functionObject.configuration?.fix as boolean */

        let fieldsConfigListLocal = functionObject.configuration?.fields as IFieldConfiguration[]
        fieldsConfigListLocal.forEach((field: IFieldConfiguration) => {

            let newject: IFieldConfigurationLocal = {
                name: field.name,
                type: field.type,
                valueInput: '',
                result: '',
                focusedInput: false
            }
            fieldsConfigList.value.push(newject)
        })
    } else {
        maskDescriptionFunction.value = ''
        descriptionFunction.value = ''
        fixConfigList.value = false
    }
})

function filterFnFormula (val: any, update: any) {
        if (val === '') {
            update(() => {
                updateFunctionsFormulaList(modelSelectedCategory.value) 
            })

            return
        }

        update(() => {
            const needle = val.toLowerCase()
            functionsFormulaList.value = functionsFormulaList.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
    }

</script>