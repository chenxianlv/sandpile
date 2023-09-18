package org.sand.model.vo.note;

import lombok.Data;
import org.sand.model.vo.common.BasicVO;
import org.sand.model.vo.user.UserSummaryVO;

import java.sql.Timestamp;
import java.util.List;

@Data
public class NoteProjectVO extends BasicVO {

    private Long id;

    private String projectName;

    private Integer openness;

    private List<UserSummaryVO> owners;

    private List<UserSummaryVO> readers;

    private String createUserNickname;

    private Timestamp createTime;

}
