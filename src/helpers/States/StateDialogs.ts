import { reactive, ref, watch } from "vue"

//showCustomDraggableDialog
export const visDragDial = ref(false)

//переключатели диалоговых окон (кастом)
export const visSettHeaderDial = ref(false)
export const visSettColsDial = ref(false)

export const visDiagDial = ref(false)

//переключатели видов выпадающих меню  (кастом)
export const visibleDropDownSettingsMenu = ref(false)

//переключатель отображения враппера выпадающих меню
export const visibleDropDownMenu = ref(false)



//переключатель контекстного меню
export const visibleContextMenu = ref(false)

export function closeContextMenu() {
    visibleContextMenu.value = false
}
export function showContextMenu() {
    visibleContextMenu.value = true
}
//////////////////////////////////////////////////////////////////////////////
//переключатель бокового окна
export const visibleSidebar = ref(false)

/* export const visibleConditionalFormattingRule = ref(false) */
//stateSidebarContent
export const stateSidebar = reactive<any>({
    visibleFormatting: false,
    visibleConditionalFormulas: false,
    visDiagSett: false,
    visValid: false,
    visHeadSett: false,
    visManagCols: false,
})

export function resetStateSidebar() {
    for (const key in stateSidebar) {
        stateSidebar[key] = false
    }
}


