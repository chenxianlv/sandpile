package org.sand.model.dto.note;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateNoteFolderDTO {

    @NotNull
    private Long id;

    private String name;

    private Long folderId;

}
