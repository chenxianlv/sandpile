package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.sand.mapper.note.NoteFolderMapper;
import org.sand.model.po.note.NoteFolderPO;
import org.sand.service.note.NoteFolderService;
import org.springframework.stereotype.Service;

@Service
public class NoteFolderServiceImpl extends ServiceImpl<NoteFolderMapper, NoteFolderPO> implements NoteFolderService {
}
