package org.sand.service.note.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.note.NoteFolderMapper;
import org.sand.model.po.note.NoteFolderPO;
import org.sand.model.po.note.NotePO;
import org.sand.service.note.NoteFolderService;
import org.sand.service.note.NoteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class NoteFolderServiceImpl extends ServiceImpl<NoteFolderMapper, NoteFolderPO> implements NoteFolderService {

    NoteService noteService;

    @Override
    public boolean deleteFolder(Long id) {
        if (!removeById(id)) {
            return false;
        }

        // 删除文件夹下的笔记
        LambdaQueryWrapper<NotePO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(NotePO::getFolderId, id);
        List<NotePO> notePOs = noteService.list(lqw);
        notePOs.forEach(notePO -> noteService.removeById(notePO.getId()));

        // 删除文件夹下的文件夹
        LambdaQueryWrapper<NoteFolderPO> lqw2 = new LambdaQueryWrapper<>();
        lqw2.eq(NoteFolderPO::getFolderId, id);
        List<NoteFolderPO> noteFolderPOs = list(lqw2);
        noteFolderPOs.forEach(noteFolderPO -> deleteFolder(noteFolderPO.getId()));

        return true;
    }
}
