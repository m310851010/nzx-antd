/**
 *
 * 用于校验 `<ng-content></ng-content>` 是否为空，自定义组件时蛮有用。
 */
export function isContentEmpty(element: HTMLElement): boolean {
  const nodes = element.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes.item(i);
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).outerHTML.trim().length !== 0) {
      return false;
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent!.trim().length !== 0) {
      return false;
    }
  }
  return true;
}
