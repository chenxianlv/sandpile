# INSERT INTO `menu_item_info`(`menu_index`, `menu_name`, `menu_key`)
# VALUES (1, '学习笔记', 'noteDisplay');

# test
INSERT INTO `note_project_info`(`id`, `project_name`, `openness`, `create_user_id`)
VALUES (1, '前端笔记', 1, 1),
       (2, '后端笔记', 1, 1),
       (3, '运维相关', 2, 1),
       (4, '计算机科学', 2, 1),
       (5, '3D建模', 3, 1);

INSERT INTO `note_info`(`name`, `file_path`, `folder_id`, `project_id`, `create_user_id`)
VALUES ('HTML', '/HTML.md', -1, 1, 1),
       ('CSS', '/CSS.md', -1, 1, 1),
       ('JavaScript', '/JavaScript.md', -1, 1, 1),
       ('TypeScript', '/TypeScript.md', -1, 1, 1),
       ('Node.js', '/Node.js.md', -1, 1, 1),
       ('Vue', '/Vue.md', 1, 1, 1),
       ('Vue', '/Vue.md', 2, 1, 1),
       ('Vue3', '/Vue3.md', 1, 1, 1),
       ('React', '/React.md', 1, 1, 1),
       ('Three.js', '/Three.js.md', 1, 1, 1),
       ('常用小型库', '/cyxxk.md', 1, 1, 1),
       ('配置文件', '/pzwj.md', 1, 1, 1),
       ('JavaSE', '/JavaSE.md', -1, 2, 1),
       ('JavaWeb', '/JavaWeb.md', -1, 2, 1),
       ('JDBC', '/JDBC.md', -1, 2, 1),
       ('Maven', '/Maven.md', -1, 2, 1),
       ('MySQL', '/MySQL.md', -1, 2, 1),
       ('SSM框架', '/SSMkj.md', -1, 2, 1),
       ('Spring周边', '/Springzb.md', -1, 2, 1),
       ('常用类库', '/cylk.md', -1, 2, 1),
       ('Nginx', '/Nginx.md', -1, 3, 1),
       ('Linux', '/Linux.md', -1, 3, 1),
       ('Debian11部署Web应用', '/Debian11Web.md', -1, 3, 1),
       ('计算机网络', '/jsjwl.md', -1, 4, 1),
       ('Blender', '/Blender.md', -1, 5, 1);

INSERT INTO `note_folder_info`(`id`, `name`, `project_id`, `folder_id`, `create_user_id`)
VALUES (1, '库', 1, -1, 1),
       (2, '库中库', 1, 1, 1);

INSERT INTO `note_project_owner`(`project_id`, `user_id`)
VALUES (1, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (5, 1);

# # admin的密码为1234，若要自定义密码，需在前端用想要的用户名和密码登录，查看发送请求中的password字段，将密码复制至EncryptTest类中进行加密，把加密后的密码作为数据库的user_password字段的值即可
# INSERT INTO `user_user`(`id`, `user_account`, `user_name`, `user_password`, `create_user_id`)
# VALUES (1, 'admin', 'administrator', '$2a$10$hbCVGHiRIfjtfrywxZRMU.ue0dhu8CmYo.iLQ4oIaZxkL1AJGfv.C', 1);
# #        (2, 'XXX', 'XXX', 'XXX', 1);

INSERT INTO `user_role`(`id`, `role_name`, `create_user_id`, `remark`)
VALUES (1, 'root', 1, '超级用户，拥有所有权限'),
       (2, 'manager', 1, '管理员，拥有编辑任意用户笔记项目的权限'),
       (3, 'normalUser', 1, '普通用户，无法对其他用户的笔记项目进行操作，允许查看开放的笔记项目');

INSERT INTO `user_access`(`id`, `access_name`, `access_url`, `create_user_id`, `remark`)
VALUES (10001, 'listUserSummaries', '/api/user/listUserSummaries', 1, '根据id或用户名查询用户概况'),
       (20001, 'editOwnedProject', null, 1, '对已拥有项目，具备增删改项目本身及内部文件的权限'),
       (20002, 'editAllProject', null, 1, '对所有项目，具备增删改项目本身及内部文件的权限'),
       (20003, 'readOwnedProject', null, 1, '对已拥有项目，具备读取项目本身及内部文件的权限'),
       (20004, 'readAllProject', null, 1, '对所有项目，具备读取项目本身及内部文件的权限'),
       (20005, 'addProject', '/api/note/addProject', 1, '新增笔记项目'),
       (20006, 'listProjects', '/api/note/listProjects', 1, '查询笔记项目')
;

INSERT INTO `user_user_role`(`user_id`, `role_id`)
VALUES (1, 1);

INSERT INTO `user_role_access`(`role_id`, `access_id`)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5),
       (1, 6),

       (2, 1),
       (2, 2),
       (2, 3),
       (2, 4),
       (2, 5),
       (2, 6),

       (3, 1),
       (3, 3),
       (3, 5),
       (3, 6);