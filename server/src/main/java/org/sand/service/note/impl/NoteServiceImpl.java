package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.apache.commons.net.ftp.FTPClient;
import org.sand.mapper.note.NoteMapper;
import org.sand.model.po.note.NotePO;
import org.sand.service.note.NoteService;
import org.sand.util.FTPUtils;
import org.sand.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
public class NoteServiceImpl extends ServiceImpl<NoteMapper, NotePO> implements NoteService {

    private final FTPUtils ftpUtils;

    private final String newFilePath = "/"; // 新文件暂时只创建在根目录

    @Override
    public String getNoteText(Long id) throws IOException {
        NotePO notePO = this.getById(id);
        FTPClient ftpClient = ftpUtils.connectFtp();
        String text = ftpUtils.readFile(ftpClient, notePO.getFilePath());
        ftpUtils.closeFtpClient(ftpClient);
        return text;

    }

    @Override
    public void setNoteText(Long id, String text) throws IOException {
        NotePO notePO = this.getById(id);
        FTPClient ftpClient = ftpUtils.connectFtp();
        String filePath = notePO.getFilePath();
        String[] splitPath = StringUtils.splitFilePath(filePath);

        ftpUtils.updateFileText(ftpClient, splitPath[0], splitPath[1], text);
    }

    @Override
    public NotePO createNote() throws IOException {
        FTPClient ftpClient = ftpUtils.connectFtp();
        String fileName = UUID.randomUUID() + ".md"; // 暂时只创建md文件

        ftpUtils.createFile(ftpClient, newFilePath, fileName);
        ftpUtils.closeFtpClient(ftpClient);

        String filePath = (Objects.equals(newFilePath, "/") ? "" : newFilePath) + "/" + fileName;

        NotePO notePO = new NotePO();
        notePO.setFilePath(filePath);
        return notePO;
    }


    @Override
    public String uploadNote(MultipartFile file) throws IOException {
        FTPClient ftpClient = ftpUtils.connectFtp();
        String fileName = UUID.randomUUID() + ".md"; // 暂时只创建md文件

        ftpUtils.uploadFile(ftpClient, newFilePath, fileName, file.getInputStream());
        ftpUtils.closeFtpClient(ftpClient);

        return (Objects.equals(newFilePath, "/") ? "" : newFilePath) + "/" + fileName;
    }

}
