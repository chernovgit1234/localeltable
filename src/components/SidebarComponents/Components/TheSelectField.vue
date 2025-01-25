
<template>
    <q-select 
        :disable="props.IdEditRule!==''"
        outlined
        v-model="model" 
        :options="props.options" 
        dense 
        options-dense
        disable-tab-selection
        map-options
    />
</template>

<script lang='ts' setup>
import { EnumColumnName } from '@/enums/EnumColumnValues';
import {defineProps, defineModel, withDefaults} from 'vue'

const model = defineModel<EnumColumnName>(EnumColumnName.Type)
const props = defineProps<{
    IdEditRule?: string,
    options: any[]
}>()
/* withDefaults(defineProps<{
   title?: string
   likes: number,
 }>(), {
     // here we have default values
     title: '---',
 }) */
/* withDefaults(
    defineProps<{
        IdEditRule?: string | null,
        options: any[] | null
    }>(), 
    {
        IdEditRule: undefined,
        options: null
    }
) */
/* defineProps<{
    IdEditRule?: string | null,
    options: any[] | null
}>() */
</script>
