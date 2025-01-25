<style lang="scss" scoped>
.diag-sett-main {
    &__body {
        padding: 5px;
        display: grid;
        grid-template-rows: 36px calc(100vh - 170px);
    }

}
</style>

<template>
    <div class="diag-sett-main">
        <div class="diag-sett-main__body">
            <q-tabs
                v-model="tabModel"
                dense
                active-color="primary"
                indicator-color="primary"
                style="padding: 0 15px;"
            >
                <q-tab name="settings" label="Настройка" class="text-capitalize"/>
                <q-tab disable name="options" label="Дополнительно" class="text-capitalize "/>
            </q-tabs>
            <q-tab-panels v-model="tabModel" animated class="text-white">
                <q-tab-panel name="settings" class="q-tab-panel scroll-custom" style="padding: 0 10px !important">
                    <TheDiagSettings></TheDiagSettings>
                </q-tab-panel>
                <q-tab-panel name="options" class="q-tab-panel scroll-custom" style="padding: 0 10px !important">
                    <TheDiagOptions></TheDiagOptions>
                </q-tab-panel>
            </q-tab-panels>
        </div> 
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import TheDiagSettings from '../Diagram/TheDiagSettings.vue'
import TheDiagOptions from '../Diagram/TheDiagOptions.vue'

enum TabsEnum {
    settings = 'settings',
    //options = 'options'
}

const tabModel = ref<TabsEnum>(TabsEnum.settings)

/* const store = useStore()
const visibleUpperPanel = computed(() => store.getters.visibleUpperPanel)
const createFormattingRule = ref();
let showRulesList = ref(true)
 */
/* function createRule() {
    
}

function editRule(rule: IConditionFormattingRules) {

} */

</script>