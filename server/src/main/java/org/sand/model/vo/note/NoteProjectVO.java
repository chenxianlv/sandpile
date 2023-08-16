package org.sand.model.vo.note;

import lombok.Data;
import org.sand.model.vo.common.BasicVO;

import java.sql.Timestamp;

@Data
public class NoteProjectVO extends BasicVO {

    private Long id;

    private String projectName;

    private Integer openness;

    private Long[] owners;

    private Long[] readers;

    private String createUserName;

    private Timestamp createTime;

}
