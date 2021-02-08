/* 添加全屏按钮 */
let isFullScreen = false;  // 是否全屏
const iNode = document.createElement('i');
iNode.style.cursor = 'pointer';
let originWidth = 0;  // 初始被点击弹窗的width
let originHeight = 0;  // 初始被点击弹窗的height
let originMarginTop = 0;  // 初始被点击弹窗marginTop
let nowDragDom = null;  // 当前操作弹窗
export default {
    bind(el, binding, vnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        iNode.className = 'fullScreen iconfont iconquanping';
        if (typeof binding.value === 'object') {
            const isfull = Object.values(binding.value)[1];
            // 如果有全屏按钮,添加按钮
            if (isfull) {
                dialogHeaderEl.appendChild(iNode);
            }
        }

        dialogHeaderEl.style.cssText += ';cursor:move;';
        dragDom.style.cssText += ';top:0px;';
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const getStyle = (function () {
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr]
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr]
            }
        })()
        // 好像是因为高度不够的原因
        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            const dragDomWidth = dragDom.offsetWidth;
            const dragDomHeight = dragDom.offsetHeight;

            const screenWidth = document.body.clientWidth;
            const screenHeight = document.body.clientHeight;

            const minDragDomLeft = dragDom.offsetLeft;
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

            const minDragDomTop = dragDom.offsetTop;
            // console.log(minDragDomTop)
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

            // 获取到的值带px 正则匹配替换
            let styL = getStyle(dragDom, 'left');
            let styT = getStyle(dragDom, 'top');
            let marginT = getStyle(dragDom, 'margin-top');
            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
                marginT = +document.body.clientHeight * (+marginT.replace(/\%/g, '') / 100);
            } else {
                styL = +styL.replace(/\px/g, '');
                styT = +styT.replace(/\px/g, '');
                marginT = +marginT.replace(/\px/g, '');
            }

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX;
                let top = e.clientY - disY;
                // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -minDragDomLeft
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }
                // 判断当前弹框是否比当前设备高
                if (screenHeight < dragDomHeight) {
                    // console.log(styT)
                    if (top + styT <= 0) {
                        top = 0;
                        dragDom.style.marginTop = 0;
                    } else {
                        top = top + styT;
                    }
                    dragDom.style.cssText += `;left:${left + styL}px;top:${top}px;`;
                } else {
                    if (-(top) > minDragDomTop) {
                        top = -minDragDomTop
                    } else if (top > maxDragDomTop) {
                        top = maxDragDomTop
                    }
                    // 移动当前元素
                    dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
                }
                // emit onDrag event
                vnode.child.$emit('dragDialog')
            };
            document.onmouseup = function (e) {
                // dragDom.style.cssText += ';top:0px;'
                document.onmousemove = null;
                document.onmouseup = null
            }
        }
        // 点击全屏
        iNode.onclick = (e) => {
            nowDragDom = e.target.parentNode.parentNode;
            if (!isFullScreen) {
                originWidth = nowDragDom.offsetWidth;
                originHeight = nowDragDom.offsetHeight;
                originMarginTop = nowDragDom.style.marginTop;
                nowDragDom.style.left = 0;
                nowDragDom.style.top = 0;
                nowDragDom.style.height = "100VH";
                nowDragDom.style.width = "100VW";
                nowDragDom.style.marginTop = 0;
                isFullScreen = true;
                dialogHeaderEl.style.cursor = 'initial';
                iNode.className = 'fullScreen iconfont  icontuichuquanping';
            } else {
                nowDragDom.style.height = originHeight + 'px';
                nowDragDom.style.width = originWidth + 'px';
                nowDragDom.style.marginTop = originMarginTop;
                isFullScreen = false;
                dialogHeaderEl.style.cursor = 'move';
                iNode.className = 'fullScreen iconfont iconquanping';
            }
        }
    },
    update(el, binding, vnode) {
        let value, oldValue = '';
        if (typeof binding.value === 'object') {
            value = Object.values(binding.value)[0];
            oldValue = Object.values(binding.oldValue)[0];
        } else {
            oldValue = binding.oldValue;
            value = binding.value;
        }
        if (oldValue !== value && value) {
            const dragDom = el.querySelector('.el-dialog');
            dragDom.style.top = 0;
            dragDom.style.left = null;
            if (nowDragDom) {
                nowDragDom.style.width = originWidth + "px";
                nowDragDom.style.marginTop = originMarginTop;
                nowDragDom.style.height = originHeight + 'px';
            }
            isFullScreen = false;
            iNode.className = 'fullScreen iconfont iconquanping';
            dragDom.style.marginTop = dragDom.style.marginTop || '10vh'; // 有单独设置marginTop的还原回原来的值，没有的默认10vh
        }

    }
}
