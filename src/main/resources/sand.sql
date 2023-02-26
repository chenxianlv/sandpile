DROP TABLE IF EXISTS `menu_item_info`;
CREATE TABLE `menu_item_info`
(
    `id`          INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '菜单项id',
    `menu_index`  INT UNIQUE      NOT NULL COMMENT '菜单项序号（序号小的排在前）',
    `menu_name`   VARCHAR(50)     NULL COMMENT '菜单项的名称（用于展示在页面上）',
    `menu_key`    VARCHAR(50)     NOT NULL COMMENT '菜单项标识',
    `deleted_flag`  BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time` TIMESTAMP DEFAULT NOW() COMMENT '创建时间',
    `update_time` TIMESTAMP DEFAULT NOW() COMMENT '最后一次编辑时间'
) COMMENT '菜单表';


DROP TABLE IF EXISTS `menu_item_parent_info`;
CREATE TABLE `menu_item_parent_info`
(
    `menu_id`        INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '菜单项id',
    `parent_menu_id` INT             NOT NULL COMMENT '父菜单项id',
    `deleted_flag`     BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`    TIMESTAMP DEFAULT NOW() COMMENT '创建时间',
    `update_time`    TIMESTAMP DEFAULT NOW() COMMENT '最后一次编辑时间'
) COMMENT '菜单中间表，指示菜单项父子关系';


DROP TABLE IF EXISTS `note_project_info`;
CREATE TABLE `note_project_info`
(
    `id`           INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '笔记项目id',
    `project_name` VARCHAR(255)    NOT NULL COMMENT '笔记项目名',
    `deleted_flag`   BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`  TIMESTAMP DEFAULT NOW() COMMENT '创建时间',
    `update_time`  TIMESTAMP DEFAULT NOW() COMMENT '最后一次编辑时间'
) COMMENT '笔记项目表';


DROP TABLE IF EXISTS `note_info`;
CREATE TABLE `note_info`
(
    `id`             INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '笔记文件id',
    `name`           VARCHAR(255)    NOT NULL COMMENT '笔记名（在项目中显示的笔记名，不一定等于物理文件名）',
    `directory_path` VARCHAR(500)    NOT NULL COMMENT '笔记所在目录的路径，以/分隔，如"/note1"表示笔记位于项目根目录下的note1目录中',
    `file_path`      VARCHAR(500)    NOT NULL COMMENT '笔记文件的物理位置，如"/docs/math.md"',
    `project_id`     INT             NOT NULL COMMENT '所属笔记项目的id',
    `deleted_flag`     BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`    TIMESTAMP DEFAULT NOW() COMMENT '创建时间',
    `update_time`    TIMESTAMP DEFAULT NOW() COMMENT '最后一次编辑时间'
) COMMENT '笔记文件表';


DROP TABLE IF EXISTS `system_params`;
CREATE TABLE `system_params`
(
    `id`          INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '系统参数id',
    `param_key`   VARCHAR(255)    NOT NULL COMMENT '参数名',
    `param_value` VARCHAR(500)    NULL COMMENT '参数值',
    `description` VARCHAR(500)    NULL COMMENT '参数描述',
    `deleted_flag`  BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time` TIMESTAMP DEFAULT NOW() COMMENT '创建时间',
    `update_time` TIMESTAMP DEFAULT NOW() COMMENT '最后一次编辑时间'
) COMMENT '系统配置参数表';


INSERT INTO `menu_item_info`(`menu_index`, `menu_name`, `menu_key`)
VALUES (1, '学习笔记', 'noteDisplay');
#        (2, 'Web 3D', 'web3D');


# INSERT INTO `system_params`(`param_key`, `param_value`, `description`)
# VALUES ('file_base_path', 'http://localhost:9135/files',
#         '文件的基本存放路径，项目中文件的路径信息为相对路径，会与该参数拼接后形成完整路径');


# test
INSERT INTO `note_project_info`(`id`, `project_name`)
VALUES (1, '前端笔记');

INSERT INTO `note_info`(`name`, `directory_path`, `file_path`, `project_id`)
VALUES ('CSS', '/', '/CSS.md', 1),
       ('HTML', '/', '/HTML.md', 1),
       ('JavaScript', '/', '/JavaScript.md', 1),
       ('Node.js', '/', '/Node.js.md', 1),
       ('TypeScript', '/', '/TypeScript.md', 1),
       ('React', '/库', '/库/React.md', 1),
       ('Three.js', '/库', '/库/Three.js.md', 1),
       ('Vue', '/库', '/库/Vue.md', 1),
       ('Vue3', '/库', '/库/Vue3.md', 1),
       ('常用小型库', '/库', '/库/常用小型库.md', 1),
       ('配置文件', '/库', '/库/配置文件.md', 1);