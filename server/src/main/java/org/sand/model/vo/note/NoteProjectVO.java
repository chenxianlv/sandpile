package org.sand.model.vo.note;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.sand.model.vo.common.BasicVO;

import java.util.Date;

@Data
public class NoteProjectVO extends BasicVO {

    private Long id;

    private String projectName;

    private String createUserName;

    @JsonFormat(timezone = "${project.time-zone}", pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

}
