import type { TreeNode } from '@/utils/tree';

export interface FileTreeNode extends TreeNode<FileTreeNode> {
    id: number;

    /**
     * true表示是笔记文件，false表示是文件夹
     */
    isFile: boolean;
}
