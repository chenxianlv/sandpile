DROP TABLE IF EXISTS `menu_item_info`;
CREATE TABLE `menu_item_info`
(
    `id`             BIGINT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '菜单项id',
    `menu_index`     INT UNIQUE         NOT NULL COMMENT '菜单项序号（序号小的排在前）',
    `menu_name`      VARCHAR(50)        NULL COMMENT '菜单项的名称（用于展示在页面上）',
    `menu_key`       VARCHAR(50)        NOT NULL COMMENT '菜单项标识',
    `deleted_flag`   BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user_id` BIGINT             NULL COMMENT '创建用户的ID',
    `update_time`    TIMESTAMP          NULL COMMENT '修改时间',
    `update_user_id` BIGINT             NULL COMMENT '修改用户的ID',
    `remark`         VARCHAR(500)       NULL COMMENT '备注'
) COMMENT '菜单表';


DROP TABLE IF EXISTS `menu_item_parent_info`;
CREATE TABLE `menu_item_parent_info`
(
    `menu_id`        BIGINT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '菜单项id',
    `parent_menu_id` BIGINT             NOT NULL COMMENT '父菜单项id'
) COMMENT '菜单中间表，指示菜单项父子关系';


DROP TABLE IF EXISTS `note_project_info`;
CREATE TABLE `note_project_info`
(
    `id`             BIGINT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '笔记项目id',
    `project_name`   VARCHAR(255)       NOT NULL COMMENT '笔记项目名',
    `deleted_flag`   BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user_id` BIGINT             NULL COMMENT '创建用户的ID',
    `update_time`    TIMESTAMP          NULL COMMENT '修改时间',
    `update_user_id` BIGINT             NULL COMMENT '修改用户的ID',
    `remark`         VARCHAR(500)       NULL COMMENT '备注'
) COMMENT '笔记项目表';


DROP TABLE IF EXISTS `note_info`;
CREATE TABLE `note_info`
(
    `id`             BIGINT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '笔记文件id',
    `name`           VARCHAR(255)       NOT NULL COMMENT '笔记名（在项目中显示的笔记名，不一定等于物理文件名）',
    `directory_path` VARCHAR(500)       NOT NULL COMMENT '笔记所在目录的路径，以/分隔，如"/note1"表示笔记位于项目根目录下的note1目录中',
    `file_path`      VARCHAR(500)       NOT NULL COMMENT '笔记文件的物理位置，如"/docs/math.md"',
    `project_id`     BIGINT             NOT NULL COMMENT '所属笔记项目的id',
    `deleted_flag`   BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user_id` BIGINT             NULL COMMENT '创建用户的ID',
    `update_time`    TIMESTAMP          NULL COMMENT '修改时间',
    `update_user_id` BIGINT             NULL COMMENT '修改用户的ID',
    `remark`         VARCHAR(500)       NULL COMMENT '备注'
) COMMENT '笔记文件表';


DROP TABLE IF EXISTS `system_params`;
CREATE TABLE `system_params`
(
    `id`             BIGINT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT COMMENT '系统参数id',
    `param_key`      VARCHAR(255)       NOT NULL COMMENT '参数名',
    `param_value`    VARCHAR(500)       NULL COMMENT '参数值',
    `description`    VARCHAR(500)       NULL COMMENT '参数描述',
    `deleted_flag`   BOOLEAN   DEFAULT FALSE COMMENT '是否逻辑删除',
    `create_time`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user_id` BIGINT             NULL COMMENT '创建用户的ID',
    `update_time`    TIMESTAMP          NULL COMMENT '修改时间',
    `update_user_id` BIGINT             NULL COMMENT '修改用户的ID',
    `remark`         VARCHAR(500)       NULL COMMENT '备注'
) COMMENT '系统配置参数表';


DROP TABLE IF EXISTS `user_user`;
CREATE TABLE `user_user`
(
    `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_account`   VARCHAR(50)     NOT NULL COMMENT '用户账号（登录用）',
    `user_name`      VARCHAR(50)     NOT NULL COMMENT '用户名（展示用）',
    `user_password`  VARCHAR(255)    NOT NULL COMMENT '密码',
    `lock_flag`      BOOLEAN         NOT NULL DEFAULT 0 COMMENT '是否被锁定',
    `delete_flag`    BOOLEAN         NOT NULL DEFAULT 0 COMMENT '是否被删除',
    `create_time`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建者ID',
    `update_time`    TIMESTAMP       NULL COMMENT '修改时间',
    `update_user_id` BIGINT UNSIGNED NULL COMMENT '修改者ID',
    `remark`         VARCHAR(255)    NULL COMMENT '备注',
    PRIMARY KEY (`id`)
) COMMENT '用户表';

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`
(
    `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_name`      VARCHAR(50)     NOT NULL COMMENT '角色名',
    `delete_flag`    BOOLEAN         NOT NULL DEFAULT 0 COMMENT '是否被删除',
    `create_time`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建者ID',
    `update_time`    TIMESTAMP       NULL COMMENT '修改时间',
    `update_user_id` BIGINT UNSIGNED NULL COMMENT '修改者ID',
    `remark`         VARCHAR(255)    NULL COMMENT '备注',
    PRIMARY KEY (`id`)
) COMMENT '角色表';

DROP TABLE IF EXISTS `user_access`;
CREATE TABLE `user_access`
(
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `access_name` VARCHAR(50)     NOT NULL COMMENT '权限名',
    `access_url`  VARCHAR(255)    NOT NULL COMMENT '资源路径',
    `delete_flag` BOOLEAN         NOT NULL DEFAULT 0 COMMENT '是否被删除',
    `create_time` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `remark`      VARCHAR(255)    NULL COMMENT '备注',
    PRIMARY KEY (`id`)
) COMMENT '权限（资源）表';

DROP TABLE IF EXISTS `user_user_role`;
CREATE TABLE `user_user_role`
(
    `id`      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
    PRIMARY KEY (`id`)
) COMMENT '用户角色表';

DROP TABLE IF EXISTS `user_role_access`;
CREATE TABLE `user_role_access`
(
    `id`        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_id`   BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
    `access_id` BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
    PRIMARY KEY (`id`)
) COMMENT '用户权限表';


INSERT INTO `menu_item_info`(`menu_index`, `menu_name`, `menu_key`)
VALUES (1, '学习笔记', 'noteDisplay');



# INSERT INTO `system_params`(`param_key`, `param_value`, `description`)
# VALUES ('file_base_path', 'http://localhost:9135/files',
#         '文件的基本存放路径，项目中文件的路径信息为相对路径，会与该参数拼接后形成完整路径');


# test
INSERT INTO `note_project_info`(`id`, `project_name`, `create_user_id`)
VALUES (1, '前端笔记', 1);

INSERT INTO `note_info`(`name`, `directory_path`, `file_path`, `project_id`, `create_user_id`)
VALUES ('CSS', '/', '/CSS.md', 1, 1),
       ('HTML', '/', '/HTML.md', 1, 1),
       ('JavaScript', '/', '/JavaScript.md', 1, 1),
       ('Node.js', '/', '/Node.js.md', 1, 1),
       ('TypeScript', '/', '/TypeScript.md', 1, 1),
       ('React', '/库', '/库/React.md', 1, 1),
       ('Three.js', '/库', '/库/Three.js.md', 1, 1),
       ('Vue', '/库', '/库/Vue.md', 1, 1),
       ('Vue3', '/库', '/库/Vue3.md', 1, 1),
       ('常用小型库', '/库', '/库/常用小型库.md', 1, 1),
       ('配置文件', '/库', '/库/配置文件.md', 1, 1);

-- ----------
-- 密码为1234
-- ----------
INSERT INTO `user_user`(`id`, `user_account`, `user_name`, `user_password`, `create_user_id`)
VALUES (1, 'admin', 'administrator', '$2a$10$G6zACWgQzdmCGgdlFYc0WeMPI8L0zwrfOAs7gwl0qWCgdD4Kw.YzG', 1),
       (2, 'cxl', 'chenxianlv', '$2a$10$G6zACWgQzdmCGgdlFYc0WeMPI8L0zwrfOAs7gwl0qWCgdD4Kw.YzG', 1);

INSERT INTO `user_role`(`id`, `role_name`, `create_user_id`)
VALUES (1, 'root', 1),
       (2, 'guest', 1);

INSERT INTO `user_access`(`id`, `access_name`, `access_url`)
VALUES (1, 'test', '/api/security/test1'),
       (2, 'test', '/api/security/test2');

INSERT INTO `user_user_role`(`user_id`, `role_id`)
VALUES (1, 1),
       (2, 2);

INSERT INTO `user_role_access`(`role_id`, `access_id`)
VALUES (1, 1),
       (1, 2),
       (2, 2);