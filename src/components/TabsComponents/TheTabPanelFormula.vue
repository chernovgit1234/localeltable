<style lang="scss">
.calc-board {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    &__body {
        width: 100%;
        align-items: center;
        justify-content: space-between;
        display: grid;
        grid-template-columns: 90% auto;
        gap: 30px;
    }

    &__block-formula {
        display: flex;
        gap: 2px;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 90%;
    }
}
.block-formula {
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;

    &__input-range {
        border: 1px solid var(--grey-border-color) !important;
        height: 30px;
        min-width: 300px !important;
        padding: 2px 10px;
        color: var(--dark-icon-color);
        background-color: #fff;
        
        span {
            display: inline-block;
            vertical-align: middle;
            line-height: normal;
            font-size: 14px;
            font-family: Google Sans,Roboto,sans-serif;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

        }
    }

    &__btn-body {
        height: 30px;
    }

    &__btn {
        height: 30px;
        width: 30px;
        background-color: #eceff1;
        border: 1px solid var(--grey-border-color) !important;
        color: var(--dark-icon-color);
        font-family:  Libertinusmath-Regular;

        span {
            font-family:  LibertinusSans-Italic !important;
            font-size: 16px;
        }
    }

    &__input-formula {
        border: 1px solid var(--grey-border-color) !important;
        min-width: 100%;
        height: 30px;
        padding: 2px 10px;
        color: var(--dark-icon-color);
        font-family: Google Sans,Roboto,sans-serif;
    }
}

</style>

<template>
    <div class="calc-board">
        <div class="calc-board__body">
            <div class="calc-board__block-formula block-formula">
                <!-- <input class="block-formula__input-range" type="text" disabled v-model="currentCellRange"> -->
                <!-- <div class="block-formula__input-range">
                    <span>{{ highlightedRangeCells }} =СУММ(</span>
                </div> -->
                <!-- <div class="block-formula__btn-body">
                    <button class="block-formula__btn" @click.stop="showFormCreateFormula()">
                        <span>fx</span>
                        <q-tooltip class="custom-tooltip">
                            Создать формулу
                        </q-tooltip> 
                    </button>
                </div> -->
                <!-- <TheTabPanelFormulaTest></TheTabPanelFormulaTest>  -->
                <!-- <input class="block-formula__input-formula" type="text" v-model="formulaText"> -->
            </div>
            <!-- <div class="calc-board__block-action">
                <button class="button">action</button>
            </div> -->
        </div>
        <!-- <CustomDialog v-if="showDialog" @closeDialog="closeDialog()">
            <template #title>
                <span>Настройка шапки</span>
            </template>
            <template #form>
                <TheFormCreateFormula v-if="typePopup === TypePopup.TheFormCreateFormula"></TheFormCreateFormula>    
            </template>
        </CustomDialog> -->

    </div>
</template>

<script lang="ts" setup>
import TheTabPanelFormulaTest from '../TabsComponents/TheTabPanelFormulaTest.vue'

import { ref, onMounted, computed, reactive, toRaw } from 'vue';
/* import HyperFormula from 'hyperformula' */
import {formulaMap} from '../../helpers/HSFormula/FormulaHelper'
import TheFormCreateFormula from './TheFormCreateFormula.vue'
import CustomDraggableDialog from '../SpecialComponents/CustomDraggableDialog.vue'
import { useStore } from 'vuex'

const store = useStore()
enum TypePopup {
    Default = 0,
    TheFormCreateFormula = 1
}

const currentSelectedCell = computed(() => {
    return store.getters.currentSelectedCell
})
const highlightedRangeCells = computed(() => {
    return store.getters.highlightedRangeCells
})
const dataByHighlightedRangeCells = computed(() => {
    //console.log('store.getters.dataByHighlightedRangeCells', store.getters.dataByHighlightedRangeCells)
    return store.getters.dataByHighlightedRangeCells
})

let rangeText = ref<string>('')
let formulaText = ref<string>('')
let showDialog = ref(false)
let typePopup = ref<TypePopup>(TypePopup.Default)
/* const hfInstance = HyperFormula.buildEmpty(); */

/*     const sheetName = hfInstance.addSheet('Mortgage Calculator');
    const sheetId = hfInstance.getSheetId(sheetName); */
    //const options = hfInstance.getRegisteredFunctionNames() as any[]

/* hfInstance.getSheetName(0) */
/* onMounted(() => {
    hfInstance.getSheetName(0)
}) */

function calcFumc() {
    //const calculatedFormula = hfInstance.calculateFormula('=СРЗНАЧ(3, 6)', 0);
    //console.log('calculatedFormula', calculatedFormula)

    /* const isFormula = hfInstance.validateFormula('=SOMME(2)');
    console.log('isFormula', isFormula) */
}

function showFormCreateFormula() {
    formulaText.value = '='
    showDialog.value = true
    typePopup.value = TypePopup.TheFormCreateFormula
}

function closeDialog() {
    console.log('closeDialog')
    showDialog.value = false
    typePopup.value = TypePopup.Default
}
</script>