<template>
    <div class="main-board">
        <div class="main-board__docs-group">
            <div class="main-board__docs" id="main-board__docs-id" v-show="configDataListLength">
                <div class="main-board__doc" @click.stop="uploadConfigData()" v-for="(item, i) in configDataList" :key="i">
                    <img class="main-board__doc-img" height="45" width="45" src="../../assets/icons/gsheet-3.svg" alt="" />
                    <small class="main-board__doc-text">{{i+1}}. {{ item.name }}</small>
                    <q-tooltip  class="custom-tooltip">
                        {{ item.name }}
                    </q-tooltip>
                </div>  
            </div>   
            <div class="main-board__docs-img" @click="showConfigDataList()" v-show="configDataListLength">
                    <img class="main-board__doc-img" src="../../assets/icons/widget4.svg" height="40" width="40" alt="">
                    <span v-show="hiddenDoks > 0" class="main-board__docs-img-text">еще <span style="font-weight: bold;">{{hiddenDoks}}</span></span>
                    <q-tooltip  class="custom-tooltip">
                        Открыть в отдельном окне
                    </q-tooltip> 
            </div>
        </div>
        
        <div class="main-board__actions">
            <div class="main-board__action" style="cursor: default;margin-right: 20px" @click.stop>
                <img v-if="typeFile === EnumFileType.ConfigData" height="45" width="45" src="../../assets/icons/gsheet-3.svg" alt="" />
                <img v-if="typeFile === EnumFileType.ExcelFile" height="45" width="45" src="../../assets/icons/excel-file.svg" alt="" />
                <q-tooltip  class="custom-tooltip">Загружено: Конфигурация данных 1 от 11.04.2022</q-tooltip>
            </div>
            <div class="main-board__action" @click.stop="initGetExcelReport()">
                <img height="40" width="40" src="../../assets/icons/export.svg" alt="" />
                <q-tooltip  class="custom-tooltip">Выгрузить данные в эксель</q-tooltip>
            </div>
            <div class="main-board__action" @click.stop="initImportExcelReport()">
                <img height="40" width="40" src="../../assets/icons/import.svg" alt="" />
                <q-tooltip  class="custom-tooltip">Загрузить данные из эксель</q-tooltip>
            </div>
            <div class="main-board__action" @click.stop="showFormByCreateConfigData()">
                <img height="50" width="50" src="../../assets/icons/data-configuration.svg" alt="" />
                <q-tooltip  class="custom-tooltip">Создание и настройка конфигураций данных</q-tooltip>
            </div>
        </div>  
        <q-dialog  class="app__popup-fixed" v-model="showDailog" persistent  >
            <ThePreviewTable v-if="typePopup === TypePopup.ThePreviewTable" @downloadLocal="downloadLocal" @closeDialog="closeDialog()" :tableHTML="tableHTML"></ThePreviewTable>  
            <TheFormByConfigDataList v-if="typePopup === TypePopup.TheFormByConfigDataList" @closeDialog="closeDialog()"></TheFormByConfigDataList>  
            <TheFormByCreateConfigData v-if="typePopup === TypePopup.TheFormByCreateConfigData" @closeDialog="closeDialog()"></TheFormByCreateConfigData>  
        </q-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits , watch, computed, watchEffect, onMounted} from 'vue';
import {exportExcelReport, importExcelReport} from '../../helpers/ReportHelper'
import XLSXtypes from 'xlsx/types';
import XLSX from 'xlsx';
import {listEnumColumnName, EnumColumnTableNumber, EnumFieldName} from '../../enums/EnumColumnValues'
import {loadData, clearData} from '../../helpers/HSTableHelper/CoreHelper'
import ThePreviewTable from '../TabsComponents/ThePreviewTable.vue'
import TheFormByCreateConfigData from '../TabsComponents/TheFormByCreateConfigData.vue'
import TheFormByConfigDataList from '../TabsComponents/TheFormByConfigDataList.vue'

import { useStore } from 'vuex'

enum TypePopup {
  Default = 0,
  ThePreviewTable = 1,
  TheFormByCreateConfigData = 2,
  TheFormByConfigDataList = 3
}
enum EnumFileType {
    Default = 'default',
    ConfigData = 'ConfigData',
    ExcelFile = 'ExcelFile'
}

const store = useStore()
const emit = defineEmits([])

let typePopup = ref<TypePopup>(TypePopup.Default)
let typeFile = ref<EnumFileType>(EnumFileType.ConfigData)
let textActiveFile = ref('')
let tableHTML = ref('')
let showDailog = ref(false)
let dataLoad = ref<any[]>([])
let hiddenDoks = ref(0)

const configDataList = computed(() => {
    return store.getters.configDataList
})
const configDataListLength = computed(() => {
    return store.getters.configDataListLength
})

onMounted(() => {
    if (configDataListLength.value) {
        calcHiddenDoks()
    }
})

watch(typeFile, (newValue: EnumFileType) => {
    switch (newValue) {
        case EnumFileType.ConfigData:
        textActiveFile.value = 'Конфигурация данных 1 от 11.04.2022'
            break;
        case EnumFileType.ExcelFile:
        textActiveFile.value = 'Документ Excel'
            break;
    }
})

function showConfigDataList() {
    showDailog.value = true
    typePopup.value = TypePopup.TheFormByConfigDataList
}

function showFormByCreateConfigData() {
    showDailog.value = true
    typePopup.value = TypePopup.TheFormByCreateConfigData
}

function downloadLocal() {
    typePopup.value = TypePopup.Default
    typeFile.value = EnumFileType.ExcelFile

    loadData(dataLoad.value)
    showDailog.value = false
}

function initGetExcelReport() {
    exportExcelReport()
}

async function uploadConfigData() {
    if (!confirm(`Вы действительно хотите загрузить данные конфигурации?`)) return

    typeFile.value = EnumFileType.ConfigData
    //загрузка конфы
}

async function initImportExcelReport() {
    const pickerOpts: any = {
        types: [
            {
                description: "docs",
                accept: {
                    "docs/*": [".xlsx", ".xls"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false
    };

    try {
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts)

        const fileData = await fileHandle.getFile();
        const file = await fileData.arrayBuffer();

        const workbook: XLSXtypes.WorkBook = XLSX.read(file);
        const sheetName: string = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        const rawData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        //получение таблицы в виде html
        const table = XLSX.utils.sheet_to_html(worksheet);
        //slice(1) чтобы отсечь строки с названиями колонок
        dataLoad.value = rawData.slice(EnumColumnTableNumber.Type).map((row: any) => {
            return {
                
                TypeRow: row[EnumColumnTableNumber.Type], 
                Name: row[EnumColumnTableNumber.Name], 
                Brand: row[EnumColumnTableNumber.Brand], 
                ProductionDate: row[EnumColumnTableNumber.ProductionDate], 
                CostOne: row[EnumColumnTableNumber.CostOne], 
                CostTwo: row[EnumColumnTableNumber.CostTwo], 
                Percent: row[EnumColumnTableNumber.Percent], 
                Present: row[EnumColumnTableNumber.Present], 
                Status: row[EnumColumnTableNumber.Status],
                Comments: row[EnumColumnTableNumber.Comments]
            }
        })

        tableHTML.value = table

        typePopup.value = TypePopup.ThePreviewTable
        showDailog.value = true
        
    } catch (error) {
        console.log('error', error)
    }
}

function calcHiddenDoks() {
    //const docsLength: number = document.querySelectorAll('#main-board__docs-id > *').length
    //const firstElementChildByDocks: HTMLCollectionOf<any> = document.querySelectorAll('#main-board__docs-id > *') as HTMLCollectionOf<any>
    const docs: HTMLDivElement = document.querySelector('#main-board__docs-id') as HTMLDivElement

    let visibleDoks
  
    if (configDataListLength.value === 1) {
        visibleDoks = Math.round(docs.getBoundingClientRect().width / 45)
    } else {
        visibleDoks = Math.round(docs.getBoundingClientRect().width / 60)
    }

    hiddenDoks.value = configDataListLength.value - visibleDoks
}

watch(configDataListLength, (newValue: any) => {
    if (configDataListLength.value && newValue) {
        calcHiddenDoks()
    }
})

function closeDialog() {
    showDailog.value = false
    typePopup.value = TypePopup.Default
}
</script>

<style lang="css">
.app__popup-fixed {
    background-color: #21212108;
    z-index: 1000;
    position: fixed;
}

.main-board {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 20px;
    align-items: center;
    justify-content: space-between;

    display: grid;
    grid-template-columns: 50% 45%;
}

.main-board__item {
    width:80px;
    background-color: var(--ex-color);
}

.main-board__docs-group {
    display: grid;
    grid-template-columns: 92% auto;
}

.main-board__docs {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding-top: 5px;
    background-color: #fafafa;
    border: 1px dashed #cacece;
}
.main-board__docs-img {
  display: flex;
  align-items: center;
  justify-content: center;  
  position: relative; 
  cursor: pointer;
}
.main-board__docs-img-text {
    position: absolute;
    bottom: -2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--hs-th-color);
    font-family: Roboto400;
    font-size: 14px !important;
}

.main-board__doc {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.main-board__doc-text {
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 45px;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px !important;
}

.main-board__actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 15px;
    align-items: center;
    justify-content: flex-end;
}
.main-board__action {
  cursor: pointer;
}
.main-board__action-active {
}

</style>../../helpers/HSTableHelper/CoreFunctionsHelper