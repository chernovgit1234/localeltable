//нахождение каретки по клавиатуре
export function getCaretPosition(elem: any) {
    let caretPos: any = 0
    let sel: any
    let range: any
    const documentLocal: any = document

    if (window.getSelection) {

        sel = window.getSelection() as any;
        //console.log('sel--anchorOffset', sel)
        if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode == elem) {
                    caretPos = range.endOffset;
                }
                //console.log('sel.rangeCount', sel.rangeCount)
                
            }
        } else if (document.getSelection() && documentLocal.selection.createRange) {
            range = documentLocal.selection.createRange();
            if (range.parentElement() == elem) {
            const tempEl = document.createElement("span");
            elem.insertBefore(tempEl, elem.firstChild);
            const tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}
//нахождение каретки по нажатию мыши createTextRange then
export async function getCurrentPositionByEventMosedown() {

    const customInput: HTMLDivElement = document.getElementById('contenteditable-input') as HTMLDivElement
    
    const cursorPosition: number = await new Promise((resolve) => {
        setTimeout(() => {
            const sel = window.getSelection && window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const selection: any = window.getSelection();
                const range: any = selection.getRangeAt(0);
                const clonedRange: any = range.cloneRange();
                clonedRange.selectNodeContents(customInput);
                clonedRange.setEnd(range.endContainer, range.endOffset);
                const cursorPosition = clonedRange.toString().length;
                resolve(cursorPosition);
            }
        })
    })

    return cursorPosition
}
/* function insertHtmlAtCursor(html: any) {
    var range: any
    var node: any
    //var window: Window 
    
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        node = range.createContextualFragment(html);
        range.insertNode(node);
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().pasteHTML(html);
    }
} */