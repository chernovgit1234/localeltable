<style lang="css">
.preview-table {
    background-color: #fff;
    min-width: 90%;
    min-height: 90vh;
    gap: 20px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.preview-table__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--table-grey-color);

}
.preview-table__content {
    font-family: Roboto400;
    overflow: auto;
    padding: 5px;
    border: 2px solid var(--table-grey-color);
}

.preview-table__content::-webkit-scrollbar {
    width: 8px;
}
.preview-table__content::-webkit-scrollbar-corner {
background: #def1ee !important;
}
.preview-table__content::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background-color: #bcd7d2 !important;    /* цвет плашки */
    border: 1px solid #def1ee;  /* padding вокруг плашки */
}
.preview-table__actions {
    display: flex;
    flex-direction: row;
    gap: 15px;
}
    
</style>
<template>
    <div class="preview-table"> 
            <div class="preview-table__header">
                <div class="text-h6">Предпросмотр документа Excel</div>
                <q-btn flat round dense icon="close" v-close-popup/>
            </div>
            <div v-html="props.tableHTML" class="preview-table__content ">
                
            </div>
            <div class="preview-table__actions">
                <button class="btn" @click.stop="downloadLocal()">Загрузить локально</button>
                <button :disabled="true" class="btn" @click.stop="downloadDatabase()">Загрузить в базу данных</button>
                <button :disabled="true" class="btn" @click.stop="downloadDatabaseAndLocal()">Загрузить локально и в базу данных</button>
            </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits} from 'vue';

const emit = defineEmits(['closeDialog', 'downloadLocal'])
const props = defineProps<{
    tableHTML: string
}>()

function downloadLocal() {
    emit('downloadLocal')
}
function downloadDatabase() {console.log('downloadDatabase')}
function downloadDatabaseAndLocal() {console.log('downloadDatabaseAndLocal')}
</script>