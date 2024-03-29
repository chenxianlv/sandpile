package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.note.NoteProjectMapper;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.service.note.NoteProjectService;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class NoteProjectServiceImpl extends ServiceImpl<NoteProjectMapper, NoteProjectPO> implements NoteProjectService {
}
