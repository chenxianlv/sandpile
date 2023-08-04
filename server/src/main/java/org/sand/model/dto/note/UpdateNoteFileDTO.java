package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateNoteFileDTO {

    @NotNull
    private Long id;

    private String name;

    private Long folderId;

    private String text;

}
