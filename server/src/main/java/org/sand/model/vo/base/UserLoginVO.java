package org.sand.model.vo.base;

import lombok.Data;

@Data
public class UserLoginVO {

    private Long id;

    private String userName;

    private String token;

    private Long[] authList;

}
