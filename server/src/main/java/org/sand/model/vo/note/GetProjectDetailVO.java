package org.sand.model.vo.note;

import lombok.Data;
import org.sand.model.vo.common.BasicVO;

import java.util.List;

@Data
public class GetProjectDetailVO extends BasicVO {

    private String projectName;

    private List<NoteVO> notes;

    private List<NoteFolderVO> noteFolders;

}
