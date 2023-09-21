/**
 * 该接口仅用于继承生成子类，泛型需传入该子类：
 * interface FileTreeNode extends TreeNode<FileTreeNode> {}
 */
export interface TreeNode<T extends TreeNode<T>> {
    children: Array<T>;

    // 根节点的parent属性为null
    parent: T | null;
}

interface IterateCallback<T, U> {
    /**
     * @param node 迭代时的节点
     * @param stop 手动停止迭代
     */
    (node: T, stop: () => void): U;
}

interface IterateOptions {
    // 是否采用深度优先遍历，默认值为true（深度优先）。若值为false，表示采用广度优先遍历
    DFS?: boolean;

    // 若为true，则仅迭代后代节点，不迭代自身。默认值为true
    iterateChildrenOnly?: boolean;
}

const iterateOptionsDefault: IterateOptions = {
    DFS: true,
    iterateChildrenOnly: true,
};

class BreakError extends Error {
    constructor() {
        super();
    }

    static throw() {
        throw new BreakError();
    }
}

export class TreeUtil {
    /**
     * 迭代传入节点及其所有子孙节点
     * @param treeNode 目标节点，会从该节点自身开始遍历，然后遍历其子孙节点
     * @param callback 遍历时调用的回调函数
     * @param options 遍历选项
     */
    static forEach<T extends TreeNode<T>>(
        treeNode: T,
        callback: IterateCallback<T, void>,
        options: IterateOptions = {}
    ) {
        try {
            const mergedOptions = { ...iterateOptionsDefault, ...options };
            if (mergedOptions.DFS) {
                const stack: Array<T> = [treeNode];
                while (stack.length > 0) {
                    // 栈不为空，所以当前节点一定不为undefined
                    const curNode = stack.pop() as T;

                    // 右侧节点先入栈，左侧节点后入栈。出栈时即为从左到右
                    stack.push(...[...(curNode.children as Array<T>)].reverse());

                    if (mergedOptions.iterateChildrenOnly && curNode === treeNode) continue;
                    callback(curNode, BreakError.throw);
                }
            } else {
                const queue: Array<T> = [treeNode];
                while (queue.length > 0) {
                    // 栈不为空，所以当前节点一定不为undefined
                    const curNode = queue.shift() as T;

                    queue.push(...(curNode.children as Array<T>));

                    if (mergedOptions.iterateChildrenOnly && curNode === treeNode) continue;
                    callback(curNode, BreakError.throw);
                }
            }
        } catch (e: unknown) {
            if (e instanceof BreakError) return;
            if (e instanceof Error) throw e;
        }
    }

    /**
     * 迭代传入节点的所有子孙节点，若回调函数返回true，停止遍历并返回此时迭代到的子孙节点
     * @param treeNode 目标节点，会从该节点自身开始遍历，然后遍历其子孙节点
     * @param callback 遍历时调用的回调函数
     * @param options 遍历选项
     */
    static findChild<T extends TreeNode<T>>(
        treeNode: T,
        callback: IterateCallback<T, boolean>,
        options: IterateOptions = {}
    ) {
        let result: T | undefined;
        TreeUtil.forEach(
            treeNode,
            (item, stop) => {
                if (callback(item, stop)) {
                    result = item;
                    stop();
                }
            },
            options
        );
        return result;
    }

    static appendChild<T extends TreeNode<T>>(parent: T, child: T) {
        child.parent = parent;
        parent.children.push(child);
    }
}

export default TreeUtil;
//
// interface Node extends TreeNode<Node> {
//     msg?: string;
// }
//
// const root: Node = {
//     children: [],
//     parent: null,
// };
// const child_L1: Node = {
//     msg: 'l1',
//     children: [],
//     parent: root,
// };
// const child_L1_L1: Node = {
//     msg: 'l1_l1',
//     children: [],
//     parent: child_L1,
// };
// const child_L1_L2: Node = {
//     msg: 'l1_l2',
//     children: [],
//     parent: child_L1,
// };
// const child_L2: Node = {
//     msg: 'l2',
//     children: [],
//     parent: root,
// };
// root.children = [child_L1, child_L2];
// child_L1.children = [child_L1_L1, child_L1_L2];
//
// TreeUtil.forEach(root, (item, stop) => {
//     console.log(item.msg);
// });
//
// console.log('----');
//
// console.log(
//     TreeUtil.findChild(root, (item, stop) => {
//         console.log(item.msg);
//         return item.msg === 'l1_l1';
//     })
// );
