import { IColumnConfifuration } from "@/types/LocalStorageTypes";
import { LocalStorageHandler } from "@/utils/LocalStorageHandler";

export function initLocalStorageValues() {
    if (LocalStorageHandler.getItem('showSearchRow') === null) {
        const headerColumnsConfifuration: IColumnConfifuration = {
            activeGroupRow: true,
            activeSearchRow: true,
            activeFilterRow: true
        }
    
        LocalStorageHandler.setItem('headerColumnsConfifuration', headerColumnsConfifuration);
    }
    
    //изначально фикс колонка 0
    if (LocalStorageHandler.getItem('posFixedColumn') === null) {
        LocalStorageHandler.setItem('posFixedColumn', 0);
    }   
    
    if (LocalStorageHandler.getItem('visibleUpperPanel') === null) {
        LocalStorageHandler.setItem('visibleUpperPanel', true);
    } 
}