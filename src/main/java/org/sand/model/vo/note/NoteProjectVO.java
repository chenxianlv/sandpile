package org.sand.model.vo.note;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class NoteProjectVO {

    private Long id;

    private String projectName;

    private String createUserName;

    @JsonFormat(timezone = "${time.time-zone}", pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

}
