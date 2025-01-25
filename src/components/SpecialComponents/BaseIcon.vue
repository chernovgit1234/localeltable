<template>
    <svg
        fill="currentColor"
        width="24"
        height="24"
        v-html="path"
        style=" margin: 0; padding: 0; width: 44px;height: 44px;"
    >
</svg> 

</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import {iconsOject} from '../../icons'
import { computed, ref } from 'vue';

const props = defineProps<{
    name: string
}>()

let path = ref(iconsOject[`${props.name}`])
/* let path = computed<string>(() => {
    return icons[props.name]
}) */
</script>