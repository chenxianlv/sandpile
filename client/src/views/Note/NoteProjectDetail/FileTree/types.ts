import type { TreeNode } from '@/utils/tree';
import { TreeUtil } from '@/utils/tree';

export interface FileTreeNode extends TreeNode<FileTreeNode> {
    id: number;

    /**
     * true表示是笔记文件，false表示是文件夹
     */
    isFile: boolean;

    /**
     * 供el-tree组件使用，节点的唯一标识。
     * 值应为：( isFile ? 'f' : 'd' ) + id
     */
    nodeKey: string;
}
