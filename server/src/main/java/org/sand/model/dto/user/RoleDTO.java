package org.sand.model.dto.user;

import lombok.Data;
import org.sand.model.po.user.AccessPO;

import java.util.List;

@Data
public class RoleDTO {

    private Long id;

    private String roleName;

    private List<AccessPO> accessList;

}
