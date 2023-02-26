// todo html支持 https://www.cnblogs.com/bitlogic/p/7705258.html
// todo 尖括号链接
/*
    todo 高级链接
    这个链接用1作为网址变量[baidu][1]
    [1]: http://www.baidu.com
*/
/*
    todo 图片
    ![alt 属性文本](图片地址)
    ![alt 属性文本](图片地址 "可选标题")
*/
/*
    todo 脚注
    使用 Markdown[^1]可以效率的书写文档, 直接转换成 HTML[^2], 你可以使用 Typora[^T] 编辑器进行书写。
    [^1]:Markdown是一种纯文本标记语言
    [^2]:HyperText Markup Language 超文本标记语言
    [^T]:NEW WAY TO READ & WRITE MARKDOWN.
*/
// todo latex公式支持
// todo 代码块解析支持

import { h } from 'vue';
import type { VNode } from 'vue';

interface ParseTreeNodeConstructorObj {
    text: string | null;
    parent: ParseTreeNode | null;
    type?: string;
    props?: anyObj;
    children?: Array<ParseTreeNode | string>;
}

class ParseTreeNode {
    /**
     * 该节点的待解析内容，若text属性为null，表示该节点已无需解析
     */
    text;

    /**
     * 父节点
     */
    parent;

    /**
     * 节点渲染成什么HTML元素
     */
    type;

    /**
     * 数据对象，详见vue的h函数的props属性
     */
    props;

    /**
     * 子元素数组
     */
    children;

    constructor({
        text,
        parent,
        type,
        props = {},
        children = [],
    }: ParseTreeNodeConstructorObj) {
        this.text = text;
        this.parent = parent;
        this.type = type;
        this.props = props;
        this.children = children;
    }
}

/**
 * 未解析节点。text属性不为 null 则为未解析节点
 */
interface UnParsedParseTreeNode extends ParseTreeNode {
    text: string;
}

/**
 * 菜单数组，存放标题的原始文本，如"## 综述"
 */
let menus: string[] = [];

/**
 * 解析markdown文本，生成vnode
 */
export function parse(originalText: string) {
    menus = [];
    const root = new ParseTreeNode({
        text: null,
        type: 'div',
        props: { id: 'write' },
        parent: null,
    });
    const firstChild = insertNodeAsChild(root, { text: originalText });
    parseStructure(firstChild as UnParsedParseTreeNode);

    const unParsedNodes: UnParsedParseTreeNode[] = [];

    /**
     * 从指定节点开始遍历树（深度优先遍历），将未解析节点传入 unParsedNodes 数组
     */
    function treeTraversal(node: ParseTreeNode | string) {
        if (typeof node === 'string') return;
        if (node.text !== null) {
            unParsedNodes.push(node as UnParsedParseTreeNode);
        }
        // 遍历子节点
        if (node.children.length > 0) {
            node.children.forEach((childNode) => {
                treeTraversal(childNode);
            });
        }
    }
    treeTraversal(root);

    // 遍历剩余未解析节点，将这些节点转为段落节点
    unParsedNodes.forEach((node) => {
        const child = insertNodeAsChild(node, {
            text: node.text,
        }) as UnParsedParseTreeNode;
        node.type = 'p';
        node.props = { class: ['md-p'] };
        (node as ParseTreeNode).text = null;
        parseText(child);
    });

    console.log(root.children);

    return {
        menus,
        vnode: render(root),
    };
}

function render(node: ParseTreeNode | string): VNode | string {
    if (typeof node === 'string') return node;
    if (node.text) {
        console.error('存在未解析节点： ', node);
        return node.text;
    }
    if (!node.type) {
        console.error('存在未指定type的节点： ', node);
        return '';
    }

    const children = node.children.map(render);
    return h(node.type, node.props, children);
}

interface BeginMatchConfig {
    [groupName: string]: {
        /**
         * 匹配开始符的正则表达式
         * 正则表达式内的分组名要求与 groupName 相同
         */
        beginReg: string;

        /**
         * 用于解析匹配文本的函数
         */
        parseFunction: (node: UnParsedParseTreeNode) => void | ParseTreeNode;
    };
}

const STRUCTURE_BEGIN_MATCH_CONFIG: BeginMatchConfig = {
    codeBlock1: {
        beginReg: '(?<=\n|^)(?<codeBlock1> *(?:(?<!\\\\)`){3})',
        parseFunction: parseCodeBlock,
    },
    codeBlock2: {
        beginReg: '(?<=\n|^)(?<codeBlock2>(?: {4})|\t)',
        parseFunction: parseCodeBlock,
    },
    latexBlock: {
        beginReg: '(?<=\n|^)(?<latexBlock>(?:(?<!\\\\)\\$){2}(?=\n))',
        parseFunction: parseLatexBlock,
    },
    title: {
        beginReg: '(?<=\n|^)(?<title>(?:(?<!\\\\)#)+ .*?(?:\n|$))',
        parseFunction: parseTitle,
    },
    horizonRule: {
        beginReg:
            '(?<=\n|^)(?<horizonRule>(?:(?<!\\\\)[*-])(?: *(?:(?<!\\\\)[*-])){2,}(?:\n|$))',
        parseFunction: parseHorizonRule,
    },
    quoteBlock: {
        beginReg: '(?<=\n|^)(?<quoteBlock> {0,3}(?<!\\\\)>)',
        parseFunction: parseQuoteBlock,
    },
    ul: {
        beginReg: '(?<=\n|^)(?<ul> {0,3}(?:(?<!\\\\)[*+-]) )',
        parseFunction: parseUnorderedList,
    },
    ol: {
        beginReg: '(?<=\n|^)(?<ol> {0,3}(?:(?<!\\\\)\\d)+\\. )',
        parseFunction: parseOrderedList,
    },
    table: {
        beginReg: '(?<=\n|^)(?<table>(?<!\\\\)\\|( *.*? *(?<!\\\\)\\|)+\n)',
        parseFunction: parseTable,
    },
    emptyLine: {
        beginReg:
            '(?<=\n|^)(?<emptyLine>(?:[\f\r\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*\n){1,})',
        parseFunction: parseEmptyLine,
    },
    html: {
        beginReg:
            '(?<=\n|^)(?<html> {0,3}(?<!\\\\)<(?<type>[a-zA-Z]+)(?: +[a-zA-Z]+=".*")* */?(?<!\\\\)>(?:\n|$))',
        parseFunction: parseHtmlBlock,
    },
};

/**
 * 结构解析，解析所有可能跨行的markdown语法
 */
function parseStructure(node: UnParsedParseTreeNode) {
    const match = baseMatch(
        STRUCTURE_BEGIN_MATCH_CONFIG,
        matchStructureEnd,
        node.text
    );
    if (!match) return;
    const { groupName, frontText, nodeText, backText } = match;

    let backNode: undefined | UnParsedParseTreeNode;

    if (frontText !== '') {
        insertNodeAsBrother(node, true, {
            text: frontText,
        });
    }

    if (backText !== '') {
        backNode = insertNodeAsBrother(node, false, {
            text: backText,
        }) as UnParsedParseTreeNode;
    }
    node.text = nodeText;

    STRUCTURE_BEGIN_MATCH_CONFIG[groupName].parseFunction(node);
    backNode && parseStructure(backNode);
}

interface MatchResult {
    /**
     * 匹配组名
     */
    groupName: string;

    /**
     * 所匹配到的文本前的所有文本
     */
    frontText: string;

    /**
     * 所匹配到的文本
     */
    nodeText: string;

    /**
     * 所匹配到的文本后的所有文本
     */
    backText: string;
}

/**
 * 通用 markdown 语法匹配，在传入文本中寻找语法的开始符，再匹配结束符，返回匹配结果
 * @param beginMatchConfig 开始符匹配配置对象
 * @param endMatchFn 结束符匹配方法
 * @param text 文本
 * @param cacheText 在递归时起效，用于保存部分文本，这一部分文本不参与匹配
 */
function baseMatch(
    beginMatchConfig: BeginMatchConfig,
    endMatchFn: (
        text: string,
        matchStartResult: RegExpExecArray,
        groupName: string
    ) => { indexEnd?: number; restartOffset?: number },
    text: string,
    cacheText: string = ''
): void | MatchResult {
    const matchStartReg = new RegExp(
        Object.values(beginMatchConfig)
            .map((obj) => obj.beginReg)
            .join('|')
    );

    // 匹配开始符
    const matchStartResult = matchStartReg.exec(text);
    if (!matchStartResult) return;

    // 获取组名
    const groupName = Object.entries(matchStartResult.groups ?? {}).find(
        ([k, v]) => v !== undefined
    )?.[0];
    if (!groupName) return;

    const indexStart = matchStartResult.index; // 开始符索引
    const lenStart = matchStartResult[0].length; // 开始符长度

    const { indexEnd, restartOffset } = endMatchFn(
        text,
        matchStartResult,
        groupName
    ); // 结束位置、重试偏移量

    // 若匹配结束符失败，将开始符及其前面的文本视为普通文本，重新匹配
    if (indexEnd === undefined) {
        const indexOffset = indexStart + lenStart + (restartOffset ?? 0);
        const cache = text.slice(0, indexOffset);
        return baseMatch(
            beginMatchConfig,
            endMatchFn,
            text.slice(indexOffset),
            cacheText + cache
        );
    }

    const frontText = cacheText + text.slice(0, indexStart);
    const nodeText = text.slice(indexStart, indexEnd);
    const backText = text.slice(indexEnd);

    return {
        groupName,
        frontText,
        nodeText,
        backText,
    };
}

/**
 * 根据跨行特征开始符的匹配结果，尝试匹配结束符
 * @return indexEnd 结束符后一个字符的索引值，若为undefined，表示匹配结束符失败
 */
function matchStructureEnd(
    text: string,
    matchStartResult: RegExpExecArray,
    groupName: string
) {
    const indexStart = matchStartResult.index; // 开始符索引
    const lenStart = matchStartResult[0].length; // 开始符长度
    const indexOffset = indexStart + lenStart;

    const slicedText = text.slice(indexStart + lenStart); // 去除开始符后的文本

    let indexEnd;
    let restartOffset;

    // 匹配结束符
    if (groupName === 'codeBlock1') {
        const match = /\n(?:(?<!\\\\)`){3}(?:\n|$)/.exec(slicedText);
        // 若没有结束符，则匹配到结尾
        indexEnd = match
            ? indexOffset + match.index + match[0].length
            : text.length;
    } else if (groupName === 'codeBlock2') {
        const match = /^.*?\n(?:(?: {4}|\t).*(?:\n|$))*/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    } else if (groupName === 'latexBlock') {
        const match = /(?<=\n)(?:(?<!\\)\$){2}(?:\n|$)/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    } else if (groupName === 'title') {
        indexEnd = indexOffset;
    } else if (groupName === 'horizonRule') {
        indexEnd = indexOffset;
    } else if (groupName === 'quoteBlock') {
        const match = /^.*?\n(?: {0,3}(?<!\\\\)>.*(?:\n|$))*/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    } else if (groupName === 'ul') {
        // 若一行以两个以上空格开始，或以任意个列表符开始，都属于列表内容
        // 若空行后的一行不是列表内容，则列表在这里结束
        const match =
            /\n(?= {0,1}\n(?!(?: {2,})|(?:\t+))(?! {0,3}(?<!\\)[*+-] ))/.exec(
                slicedText
            );
        // 若没有结束符，则匹配到结尾
        indexEnd = match
            ? indexOffset + match.index + match[0].length
            : text.length;
    } else if (groupName === 'ol') {
        // 同ul
        const match =
            /\n(?= {0,1}\n(?!(?: {2,})|(?:\t+))(?! {0,3}(?:(?<!\\)\d)+\. ))/.exec(
                slicedText
            );
        indexEnd = match
            ? indexOffset + match.index + match[0].length
            : text.length;
    } else if (groupName === 'table') {
        const columnsNumber =
            Array.from(matchStartResult[0].matchAll(/(?<!\\)\|/g))?.length -
                1 ?? 0;
        const formatRow = slicedText.split('\n', 1)[0];
        const formatCheckReg = new RegExp(
            `(?<!\\\\)\\|(?: *:?-+:? *(?<!\\\\)\\|){${columnsNumber}}`
        );
        if (formatCheckReg.test(formatRow)) {
            const match = new RegExp(
                `((?<!\\\\)\\|(?:.*?(?<!\\\\)\\|){${columnsNumber}}(?:\n|$))+`
            ).exec(slicedText);
            if (match) indexEnd = indexOffset + match.index + match[0].length;
        }
    } else if (groupName === 'emptyLine') {
        indexEnd = indexOffset;
    } else if (groupName === 'html') {
        const type = matchStartResult.groups?.type;
        if (type) {
            if (matchStartResult[0].lastIndexOf('/') === lenStart - 3) {
                // 单标签
                indexEnd = indexOffset;
            } else {
                // 双标签
                const match = new RegExp(
                    `(?<=\n|^) {0,3}(?<!\\\\)</ *${type}(?<!\\\\)>(?:\n|$)`
                ).exec(slicedText);
                if (match)
                    indexEnd = indexOffset + match.index + match[0].length;
            }
        }
    }
    return { indexEnd, restartOffset };
}

const TEXT_BEGIN_MATCH_CONFIG: BeginMatchConfig = {
    latex: {
        beginReg: '(?<latex>(?:(?<!\\\\)\\$){2})',
        parseFunction: parseInlineLatex,
    },
    bold: {
        beginReg: '(?<bold>(?:(?<!\\\\)[*_]){2,})',
        parseFunction: parseBold,
    },
    italic: {
        beginReg: '(?<italic>(?<!\\\\)[*_])',
        parseFunction: parseItalic,
    },
    lineThrough: {
        beginReg: '(?<lineThrough>(?:(?<!\\\\)~){2})',
        parseFunction: parseLineThrough,
    },
    code: {
        beginReg: '(?<code>(?:(?<!\\\\)`)+)',
        parseFunction: parseInlineCode,
    },
    link: {
        beginReg: '(?<link>(?<!\\\\)\\[.*?(?<!\\\\)\\]\\(.+?\\))',
        parseFunction: parseLink,
    },
};

/**
 * 文本解析
 */
function parseText(node: UnParsedParseTreeNode) {
    const match = baseMatch(TEXT_BEGIN_MATCH_CONFIG, matchInlineEnd, node.text);
    if (!match) {
        parsePureTextNode(node);
        return;
    }

    const { groupName, frontText, nodeText, backText } = match;

    let frontNode: undefined | UnParsedParseTreeNode;
    let backNode: undefined | UnParsedParseTreeNode;

    if (frontText !== '') {
        frontNode = insertNodeAsBrother(node, true, {
            text: frontText,
        }) as UnParsedParseTreeNode;
    }

    if (backText !== '') {
        backNode = insertNodeAsBrother(node, false, {
            text: backText,
        }) as UnParsedParseTreeNode;
    }
    node.text = nodeText;

    TEXT_BEGIN_MATCH_CONFIG[groupName].parseFunction(node);
    frontNode && parsePureTextNode(frontNode);
    backNode && parseText(backNode);

    /**
     * 将纯文本节点解析为span
     */
    function parsePureTextNode(node: UnParsedParseTreeNode) {
        node.type = 'span';
        node.children = [handleEscapeChar(node.text)];
        (node as ParseTreeNode).text = null;
    }
}

/**
 * 根据行内特征开始符的匹配结果，尝试匹配结束符
 * @return indexEnd 结束符后一个字符的索引值，若为undefined，表示匹配结束符失败
 */
function matchInlineEnd(
    text: string,
    matchStartResult: RegExpExecArray,
    groupName: string
) {
    const indexStart = matchStartResult.index; // 开始符索引
    const lenStart = matchStartResult[0].length; // 开始符长度
    const indexOffset = indexStart + lenStart;

    const slicedText = text.slice(indexStart + lenStart); // 去除开始符后的文本

    let indexEnd;
    let restartOffset;

    // 匹配结束符
    if (groupName === 'bold') {
        const match = /(?:(?<!\\)[*_]){2,}/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    } else if (groupName === 'italic') {
        const match = /(?:(?<!\\)[*_])+/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    } else if (groupName === 'code') {
        // 若不加左右断言，可能会在 ``` 中匹配 ``
        // 行内代码有特殊性：结束符前紧跟的\不被视为转义符
        const match = new RegExp(
            `(?<!\`)\`(?:(?<!\\\\)\`){${lenStart - 1}}(?!\`)`
        ).exec(slicedText);
        // 若匹配失败，仅去除第一个 ` 再去重新匹配
        if (match) {
            indexEnd = indexOffset + match.index + match[0].length;
        } else {
            restartOffset = 1 - lenStart;
        }
    } else if (groupName === 'lineThrough') {
        const match = /(?:(?<!\\)~){2,}/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    } else if (groupName === 'link') {
        indexEnd = indexOffset;
    } else if (groupName === 'latex') {
        const match = /(?:(?<!\\)\$){2,}/.exec(slicedText);
        if (match) indexEnd = indexOffset + match.index + match[0].length;
    }
    return { indexEnd, restartOffset };
}

/**
 * 解析代码块
 */
function parseCodeBlock(node: UnParsedParseTreeNode) {
    let content = '';

    if (/^ *```/.test(node.text)) {
        // 反引号格式代码块

        const match = /(?<=```.*\n)(?:.|\n)*(?=```)/.exec(node.text);
        if (match) content = match[0];

        // 语言标记
        const language = /(?<=^```).*/.exec(node.text)?.[0] ?? '';
        if (language) {
            insertNodeAsChild(node, {
                text: null,
                type: 'span',
                props: { class: ['lang'] },
                children: [language],
            });
        }
    } else {
        // 缩进格式代码块
        content = node.text.replace(/(?<=\n|^)(?: {4}|\t)/g, '');
    }
    if (content.endsWith('\n')) content = content.slice(0, -1);

    node.type = 'pre';
    node.props = { class: ['md-fences'] };
    (node as ParseTreeNode).text = null;

    const codeMirrorWrap = insertNodeAsChild(node, {
        text: null,
        type: 'div',
        props: { class: ['CodeMirror', 'CodeMirror-wrap'] },
    });
    const codeMirrorScroll = insertNodeAsChild(codeMirrorWrap, {
        text: null,
        type: 'div',
        props: { class: ['CodeMirror-scroll'] },
    });
    const codeMirrorSizer = insertNodeAsChild(codeMirrorScroll, {
        text: null,
        type: 'div',
        props: { class: ['CodeMirror-sizer'] },
    });
    const relativeDiv = insertNodeAsChild(codeMirrorSizer, {
        text: null,
        type: 'div',
        props: { style: { position: 'relative', top: '0px' } },
    });
    const codeMirrorLines = insertNodeAsChild(relativeDiv, {
        text: null,
        type: 'div',
        props: { class: ['CodeMirror-lines'] },
    });
    const relativeDiv2 = insertNodeAsChild(codeMirrorLines, {
        text: null,
        type: 'div',
        props: { style: { position: 'relative', outline: 'none' } },
    });
    const codeMirrorCode = insertNodeAsChild(relativeDiv2, {
        text: null,
        type: 'div',
        props: { class: ['CodeMirror-code'] },
    });
    const codeMirrorLine = insertNodeAsChild(codeMirrorCode, {
        text: null,
        type: 'pre',
        props: { class: ['CodeMirror-line'] },
        children: [content],
    });
}

/**
 * 解析公式块
 */
function parseLatexBlock(node: UnParsedParseTreeNode) {
    let content = '';
    const match = /(?<=(?:(?<!\\)\$){2}.*\n)(?:.|\n)*(?=(?:(?<!\\)\$){2})/.exec(
        node.text
    );
    if (match) content = match[0];
    if (content.endsWith('\n')) content = content.slice(0, -1);

    node.type = 'div';
    node.props = { class: ['latex-block', 'block-container'] };
    (node as ParseTreeNode).text = null;

    insertNodeAsChild(node, {
        text: null,
        type: 'span',
        children: [content],
    });
}

/**
 * 解析标题
 * 1. 标题会被添加至菜单（引用块内的标题除外）
 */
function parseTitle(node: UnParsedParseTreeNode) {
    const hashtagCount = /^#*/.exec(node.text)?.[0].length ?? 0;
    if (hashtagCount < 1 || hashtagCount > 6) return;
    const child = insertNodeAsChild(node, {
        text: node.text.slice(hashtagCount + 1),
    }) as UnParsedParseTreeNode;
    node.type = `h${hashtagCount}`;
    if (node.text) {
        node.props = { id: node.text.replace(/^#* /, '').trimEnd() };
        menus.push(node.text.trimEnd());
    }
    (node as ParseTreeNode).text = null;
    parseText(child);
}

/**
 * 解析分割线
 */
function parseHorizonRule(node: UnParsedParseTreeNode) {
    node.type = 'hr';
    (node as ParseTreeNode).text = null;
}

/**
 * 解析引用，仅对传入节点生效
 * 1. 引用块后必须有一个空行，引用块前无要求。
 * 2. 引用块的每一行都以引用标识 > 开头，行内的>的前面可以有0-3个空格，后面的空格会被归为引用块内
 * 3. 引用块内可以嵌套任意markdown代码，内部的标题会被解析但不会添加至菜单
 * 4. 容错：引用块的行可以不以>开头，会自动解析为引用块的行，但该行必须有内容，且引用块的第一行必须以>开头
 */
function parseQuoteBlock(node: UnParsedParseTreeNode) {
    const content = node.text.replace(/(?<=\n|^) {0,3}(?<!\\\\)>/g, '');

    node.type = 'blockquote';
    node.props = { class: ['block-container'] };
    (node as ParseTreeNode).text = null;
    const child = insertNodeAsChild(node, {
        text: content,
    }) as UnParsedParseTreeNode;
    parseStructure(child);
}

/**
 * 通用列表解析方法，解析节点的text，生成li子节点
 * @param node
 * @param identifier 列表标识符，传入正则表达式
 */
function parseList(node: UnParsedParseTreeNode, identifier: string) {
    const indentCount =
        new RegExp(`^ {0,3}(?=${identifier} )`).exec(node.text)?.[0].length ??
        -1;
    if (indentCount < 0) throw new Error('format error');

    const listItems = node.text.split(
        new RegExp(
            `(?<=\n|^)(?= {${Math.max(indentCount - 1, 0)},${
                indentCount + 1
            }}${identifier} )`
        )
    );

    listItems.forEach((listItem) => {
        const lines = listItem.split('\n');
        const indent =
            new RegExp(`^ {0,3}${identifier} `).exec(lines[0])?.[0].length ?? 0;

        const content =
            lines
                .map((line, i) => {
                    return i === 0
                        ? line.slice(indent)
                        : line
                              .replace(new RegExp(`^ {0,${indent}}`), '')
                              .replace(/^\t+/, '');
                })
                .join('\n') + '\n'; // 列表因为匹配的原因，结尾可能会少截取一个换行，在此补充

        const li = insertNodeAsChild(node, {
            text: null,
            type: 'li',
            props: {},
        });
        parseStructure(
            insertNodeAsChild(li, { text: content }) as UnParsedParseTreeNode
        );
    });
}

/**
 * 解析无序列表
 */
function parseUnorderedList(node: UnParsedParseTreeNode) {
    parseList(node, '(?<!\\\\)[*+-]');
    node.type = 'ul';
    (node as ParseTreeNode).text = null;
}

/**
 * 解析有序列表
 */
function parseOrderedList(node: UnParsedParseTreeNode) {
    parseList(node, '(?:(?<!\\\\)\\d)+\\.');
    node.type = 'ol';
    (node as ParseTreeNode).text = null;
}

/**
 * 解析表格
 */
function parseTable(node: UnParsedParseTreeNode) {
    const splits = node.text.split('\n');
    if (splits.length < 2) throw new Error();

    node.type = 'table';
    (node as ParseTreeNode).text = null;

    const columnStyle = getTableData(splits[1]).map((text) => {
        text = text.trim();
        if (text.startsWith(':') && text.endsWith(':')) {
            return 'text-align:center;';
        } else if (text.startsWith(':')) {
            return 'text-align:left;';
        } else if (text.endsWith(':')) {
            return 'text-align:right;';
        }
        return '';
    });

    const thead = insertNodeAsChild(node, {
        text: null,
        type: 'thead',
    });
    parseLine(thead, splits[0], 'th');

    const tbody = insertNodeAsChild(node, {
        text: null,
        type: 'tbody',
    });
    splits.slice(2).forEach((text) => parseLine(tbody, text, 'td'));

    function parseLine(node: ParseTreeNode, text: string, childType: string) {
        const tr = insertNodeAsChild(node, { text: null, type: 'tr' });
        getTableData(text).forEach((data, i) => {
            const child = insertNodeAsChild(tr, {
                text: null,
                props: { style: columnStyle[i] },
                type: childType,
            });
            insertNodeAsChild(child, {
                text: data,
            });
        });
    }
    function getTableData(text: string) {
        return text
            .split(/(?<!\\)\|/g)
            .slice(1, -1)
            .map((t) => t.trim());
    }
}

/**
 * 解析空行
 * 将传入节点按空行分割为多个节点
 */
function parseEmptyLine(node: UnParsedParseTreeNode) {
    let linebreakCount = Array.from(node.text).reduce(
        (pre, cur) => (cur === '\n' ? pre + 1 : pre),
        0
    );

    while (linebreakCount > 2) {
        insertNodeAsBrother(node, true, {
            text: null,
            props: { class: ['md-p'] },
            type: 'p',
        });
        linebreakCount -= 2;
    }
    deleteNode(node);
}

/**
 * 解析html（暂未实现）
 */
function parseHtmlBlock(node: UnParsedParseTreeNode) {
    node.type = 'div';
    node.children = [node.text];
    node.props = { class: ['html-block'] };
    (node as ParseTreeNode).text = null;
}

function parseInlineLatex(node: UnParsedParseTreeNode) {
    const match = node.text.match(
        /(?<=^(?:(?<!\\)\$){2}).*(?=(?:(?<!\\)\$){2}$)/
    );
    if (!match) throw new Error('format error');

    node.type = 'span';
    node.props = {
        class: ['inline-latex'],
    };
    node.children = [match[0]];
    (node as ParseTreeNode).text = null;
}

function parseBold(node: UnParsedParseTreeNode) {
    const match = node.text.match(
        /(?<=^(?:(?<!\\)[*_]){2}).*(?=(?:(?<!\\)[*_]){2}$)/
    );
    if (!match) throw new Error('format error');

    node.type = 'strong';
    (node as ParseTreeNode).text = null;

    const child = insertNodeAsChild(node, {
        text: match[0],
    }) as UnParsedParseTreeNode;
    parseText(child);
}

function parseItalic(node: UnParsedParseTreeNode) {
    const match = node.text.match(/(?<=^(?<!\\)[*_]).*(?=(?<!\\)[*_]$)/);
    if (!match) throw new Error('format error');

    node.type = 'em';
    (node as ParseTreeNode).text = null;

    const child = insertNodeAsChild(node, {
        text: match[0],
    }) as UnParsedParseTreeNode;
    parseText(child);
}

function parseLineThrough(node: UnParsedParseTreeNode) {
    const match = node.text.match(
        /(?<=^(?:(?<!\\)~){2}).*(?=(?:(?<!\\)~){2}$)/
    );
    if (!match) throw new Error('format error');

    node.type = 'del';
    (node as ParseTreeNode).text = null;

    const child = insertNodeAsChild(node, {
        text: match[0],
    }) as UnParsedParseTreeNode;
    parseText(child);
}

function parseInlineCode(node: UnParsedParseTreeNode) {
    const startLen = node.text.match(/^`+/)?.[0].length ?? 1;
    const match = node.text.match(
        new RegExp(`(?<=^(\`{${startLen}})).*(?=\`{${startLen}}$)`)
    );
    if (!match) throw new Error('format error');
    let text = match[0];
    // 针对`` `xx` ``的特殊处理，需要显示<code>`xx`</code>
    if (text.trimStart().startsWith('`')) text = text.trimStart();
    if (text.trimEnd().endsWith('`')) text = text.trimEnd();
    node.type = 'code';
    node.props = {
        class: ['inline-code'],
    };
    node.children = [text];
    (node as ParseTreeNode).text = null;
}

/**
 * 解析链接，暂不支持<>形式的链接
 */
function parseLink(node: UnParsedParseTreeNode) {
    const match = node.text.match(
        /^(?<!\\)\[(?<content>.*?)(?<!\\)\]\((?<href>.+?)\)$/
    );
    if (!match || !match.groups) throw new Error('format error');

    let { content, href } = match.groups;
    if (content === '') content = href;

    node.props = {};

    if (href.startsWith('#')) {
        href = href.replace(/^#+ */, '#');
    } else {
        node.props.target = '_blank';
    }

    node.type = 'a';
    node.props.href = href;

    (node as ParseTreeNode).text = null;

    const child = insertNodeAsChild(node, {
        text: content,
    }) as UnParsedParseTreeNode;
    parseText(child);
}

function parseImg(node: UnParsedParseTreeNode) {}

function parseFootnote(node: UnParsedParseTreeNode) {}

/**
 * 将转义字符的\去除
 */
function handleEscapeChar(text: string) {
    return text.replaceAll(/\\(?=[_*|#!~+$`><[\]^-])/g, '');
}

/**
 * 将目标节点插入至源节点的前面或后面
 * @param source 源节点
 * @param front 表示插入方位，若为true表示将目标节点插入至前面，反之插入至后面
 * @param target 目标节点
 */
function insertNodeAsBrother(
    source: ParseTreeNode,
    front: boolean,
    target: Omit<ParseTreeNodeConstructorObj, 'parent'>
) {
    if (!source.parent) throw new Error('无法为根节点添加兄弟节点');
    const targetImpl = new ParseTreeNode({ ...target, parent: source.parent });
    const arr = source.parent.children;
    arr.splice(arr.indexOf(source) + Number(!front), 0, targetImpl);
    return targetImpl;
}

/**
 * 将目标节点插入为源节点的子节点
 * @param source 源节点
 * @param target 目标节点
 */
function insertNodeAsChild(
    source: ParseTreeNode,
    target: Omit<ParseTreeNodeConstructorObj, 'parent'>
) {
    const targetImpl = new ParseTreeNode({ ...target, parent: source });
    source.children.push(targetImpl);
    return targetImpl;
}

/**
 * 删除节点
 */
function deleteNode(node: ParseTreeNode) {
    node.parent?.children.splice(node.parent.children.indexOf(node), 1);
}
