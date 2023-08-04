package org.sand.model.vo.note;

import lombok.Data;

import java.util.List;

@Data
public class GetProjectDetailVO {

    private String projectName;

    private List<NoteVO> notes;

    private List<NoteFolderVO> noteFolders;

}
