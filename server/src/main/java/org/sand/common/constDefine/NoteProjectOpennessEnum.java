package org.sand.common.constDefine;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NoteProjectOpennessEnum {

    /**
     * 完全开放，所有用户包括匿名用户均可查看
     */
    FULL_PUBLIC(1),

    /**
     * 部分开放，仅读者及所有者可以查看
     */
    HALF_PUBLIC(2),

    /**
     * 私有，仅所有者可以查看
     */
    PRIVATE(3);


    private final Integer value;
}
