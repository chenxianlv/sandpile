package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class AddNoteFileDTO {

    @NotNull
    private Long projectId;

    @NotBlank
    private String name;

    @NotNull
    private Long folderId;

}
