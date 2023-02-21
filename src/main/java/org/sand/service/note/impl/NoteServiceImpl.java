package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.sand.mapper.note.NoteMapper;
import org.sand.model.po.note.NotePO;
import org.sand.service.note.NoteService;
import org.springframework.stereotype.Service;

@Service
public class NoteServiceImpl extends ServiceImpl<NoteMapper, NotePO> implements NoteService {
}
