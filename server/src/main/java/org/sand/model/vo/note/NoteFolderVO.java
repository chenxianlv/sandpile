package org.sand.model.vo.note;

import lombok.Data;
import org.sand.model.vo.common.BasicVO;

@Data
public class NoteFolderVO extends BasicVO {

    private Long id;

    private String name;

    private Long folderId;

}
