package org.sand.model.vo.note;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteVO {

    private Long id;

    private String name;

    private Long folderId;

}
