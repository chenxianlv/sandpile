package org.sand.model.dto.note;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UploadNoteFileDTO {

    @NotNull
    private Long projectId;

    @NotBlank
    private String name;

    @NotNull
    private Long folderId;

    @NotNull
    private MultipartFile file;

}
