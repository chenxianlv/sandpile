package org.sand.common.constDefine;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RoleEnum {
    ROOT(1L),
    ANONYMOUS(2L),
    MANAGER(3L),
    NORMAL_USER(4L);

    private final Long id;
}
