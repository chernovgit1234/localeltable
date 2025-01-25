<style lang="scss">

.condition-formulas-byfield {
    &__body {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    &__create-form {

    }

    &__rules {
    }
}

</style>

<template>
    <div class="condition-formulas-byfield">
        <div class="condition-formulas-byfield__body">
            <div class="condition-formulas-byfield__create-form">
                <TheConditionalFormulasCreateForm ref="cndcrtfr" @closeFormCreateCondition="closeFormCreateCondition"></TheConditionalFormulasCreateForm>
            </div>
            <div class="condition-formulas-byfield__rules">
                <TheConditionalFormulasRulesList @editRule="editRule"></TheConditionalFormulasRulesList>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TheConditionalFormulasCreateForm from './TheConditionalFormulasCreateForm.vue'
import TheConditionalFormulasRulesList from './TheConditionalFormulasRulesList.vue'
import { defineEmits, nextTick } from 'vue';
import { IConditionFormulasRule } from '@/types/ConditionalFormulasTyles';

const cndcrtfr = ref();
const emit = defineEmits(['closeFormCreateCondition'])

function closeFormCreateCondition() {
    emit('closeFormCreateCondition')
    cndcrtfr.value.resetEditMode()
}
function editRule(rule: IConditionFormulasRule) {
    if (rule) cndcrtfr.value.editConditionRule(rule)
}
</script>