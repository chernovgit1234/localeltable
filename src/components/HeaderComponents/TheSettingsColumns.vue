<style lang="scss" scoped>
.manag-cols {
    &__body {
        padding: 5px;
        display: grid;
        grid-template-rows: 36px calc(100vh - 170px);
    }
}
</style>

<template>
    <div class="manag-cols">
        <div class="manag-cols__body">
            <q-tabs
                v-model="tabModel"
                dense
                active-color="primary"
                indicator-color="primary"
                style="padding: 0 15px;"
            >
                <q-tab style="" name="settings" label="Настройка" class="text-capitalize"/>
                <q-tab :disable="countPresets==0" name="list" :label="labelPresetTab" class="text-capitalize"/>
            </q-tabs>
            <q-tab-panels v-model="tabModel" animated class="text-white">
                <q-tab-panel name="settings" class="q-tab-panel scroll-custom">
                    <TheSettingsPresets></TheSettingsPresets>
                </q-tab-panel>
                <q-tab-panel name="list" :disable="countPresets==0" class="q-tab-panel scroll-custom">
                    <TheListPresets></TheListPresets>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, watch } from 'vue';
    import TheListPresets from '../TheListPresets.vue'
    import TheSettingsPresets from '../TheSettingsPresets.vue'
    import { useStore } from 'vuex'
    import { IPreset } from '../../types/PresetTypes'
    
    enum TabsEnum {
        settings = 'settings',
        list = 'list'
    }

    const store = useStore()

    const tabModel = ref<TabsEnum>(TabsEnum.settings)
    const countPresets = computed<number>(() => store.getters.presets.filter((preset: IPreset) => !preset.isDefault).length)
    const labelPresetTab = computed<string>(() => `Пресеты (${countPresets.value})`)
    watch(countPresets, (newValue: number) => {
        if (newValue === 0) {
            tabModel.value = TabsEnum.settings
        }
    })
</script>