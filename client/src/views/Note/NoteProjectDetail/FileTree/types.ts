export interface TreeNode {
    id: number;

    /**
     * true表示是笔记文件，false表示是文件夹
     */
    isFile: boolean;

    children?: Array<TreeNode>;

    /**
     * 判断该节点是否有一个子孙节点，其id等于传入的id
     */
    isChildren: (targetId: number) => boolean;
}
