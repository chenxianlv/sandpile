package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@TableName("note_info")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotePO {

    private Integer id;

    private String name;

    @TableField("file_path")
    private String url;

    @TableField("directory_path")
    private String path;

    @TableField("project_id")
    private Integer projectId;

}
