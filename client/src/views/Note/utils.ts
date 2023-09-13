import { addNoteFolderAPI, uploadNoteFileAPI } from '@/api/note';
import { i18n } from '@/lang';
import { TreeUtil } from '@/utils/tree';
import type { TreeNode } from '@/utils/tree';

const $t = i18n.global.t;
const acceptFileTypes = ['.txt', '.md'];

export async function uploadSingleFile(file: File, projectId: number, parentFolderId: number) {
    const suffixIndex = acceptFileTypes.reduce((result, suffix) => {
        if (result !== -1) return result;
        const index = file.name.lastIndexOf(suffix);
        if (index !== -1 && index + suffix.length === file.name.length) {
            return index;
        }
        return result;
    }, -1);
    if (file.size >= 10 * 1024 * 1024)
        throw new Error($t('msg.uploadFileSizeOverflow', { size: '10MB' }));
    if (suffixIndex === -1) throw new Error($t('msg.uploadFileFormatNotSupported'));

    const fileName = file.name.slice(0, suffixIndex);
    await uploadNoteFileAPI({
        file,
        projectId,
        folderId: parentFolderId,
        name: fileName,
    });
    return fileName;
}

interface InputFileTreeNode extends TreeNode<InputFileTreeNode> {
    name: string;

    /**
     * true表示是笔记文件，false表示是文件夹
     */
    isFile: boolean;

    file?: File;
}

/**
 * 解析input的directory模式选中的文件夹
 */
export function parseFolder(files: Array<File>) {
    const rootNode: InputFileTreeNode = {
        name: '',
        isFile: false,
        children: [],
        parent: null,
    };
    for (const file of Object.values(files)) {
        const path = file.webkitRelativePath.split('/');

        for (let i = 0; i < path.length; i++) {
            const itemName = path[i];
            if (i === 0) {
                rootNode.name = itemName;
            }
            let parentNode = rootNode;

            if (i < path.length - 1) {
                // 是文件夹
                const node = TreeUtil.findChild(rootNode, (node) => node.name === itemName, {
                    iterateChildrenOnly: false,
                });
                if (node !== undefined) {
                    // 文件夹已创建
                    parentNode = node;
                } else {
                    // 文件夹未创建
                    const newNode = {
                        name: itemName,
                        isFile: false,
                        children: [],
                        parent: parentNode,
                    };
                    TreeUtil.appendChild(parentNode, newNode);
                    parentNode = newNode;
                }
            } else {
                // 是文件
                const node = {
                    name: itemName,
                    isFile: true,
                    children: [],
                    parent: parentNode,
                    file,
                };
                TreeUtil.appendChild(parentNode, node);
            }
        }
    }
    return rootNode;
}

export async function uploadFolder(
    files: Array<File>,
    projectId: number,
    parentFolderId: number,
    skipRootFolder = false
) {
    const folderIdMap: SimpleObj<number> = {};
    const uploadFilePromiseArr = [];

    for (const file of Object.values(files)) {
        const path = file.webkitRelativePath.split('/');
        let parentId = parentFolderId;

        for (let i = 0; i < path.length; i++) {
            const itemName = path[i];
            if (i === 0 && skipRootFolder) continue;

            if (i < path.length - 1) {
                // 是文件夹

                let folderId = folderIdMap[itemName];
                if (folderId !== undefined) {
                    // 文件夹已被创建
                    parentId = folderId;
                } else {
                    // 文件夹未创建
                    const res = await addNoteFolderAPI({
                        name: itemName,
                        projectId,
                        folderId: parentId,
                    });
                    folderId = res.data.data.id;
                    folderIdMap[itemName] = folderId;
                    parentId = folderId;
                }
            } else {
                // 是文件
                uploadFilePromiseArr.push(uploadSingleFile(file, projectId, parentId));
            }
        }
    }
    const resArr = await Promise.allSettled(uploadFilePromiseArr);
    for (const res of resArr) {
        if (res.status === 'rejected') throw res.reason;
    }
    // 文件夹名称
    return Object.keys(folderIdMap)[0] ?? '';
}

export function selectFile() {
    return new Promise<File | undefined>((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = acceptFileTypes.join(',');
        input.onchange = () => {
            return resolve(input.files?.[0]);
        };
        input.click();
    });
}

export function selectFolder() {
    return new Promise<Array<File> | undefined>((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.directory = true;
        input.webkitdirectory = true;
        input.onchange = () => {
            const files = input.files;
            if (!files) return resolve(undefined);

            // 将不符合后缀格式的文件排除
            const result: Array<File> = [];
            for (const file of Object.values(files)) {
                const suffixIndex = acceptFileTypes.reduce((result, suffix) => {
                    if (result !== -1) return result;
                    const index = file.name.lastIndexOf(suffix);
                    if (index !== -1 && index + suffix.length === file.name.length) {
                        return index;
                    }
                    return result;
                }, -1);
                if (suffixIndex === -1) continue;
                result.push(file);
            }

            return resolve(result);
        };
        input.click();
    });
}
