package com.saeed.audio.controllers;

import com.saeed.audio.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class DirectoryController {

    private static final Map<String, MediaType> MEDIA_TYPE_MAP = Map.of(
        "mp3", MediaType.parseMediaType("audio/mpeg")
    );

    private final DirectoryService directoryService;

    @GetMapping("/directory/music")
    public List<String> getFilesFromMusicDirectory() {
        log.info("Getting audio from ~/Music directory...");
        List<String> files = directoryService.getFilesFromMusicDirectory();
        log.info("Returning files from music directory: count={}", files.size());
        return files;
    }

    @GetMapping("/directory/file")
    public ResponseEntity<Resource> getFile(@RequestParam String path) {
        log.info("Getting file from path: {}", path);
        Resource resource = new FileSystemResource(Paths.get(path).normalize());
        return ResponseEntity.ok()
            .contentType(getMediaTypeFromExt(path))
            .body(resource);
    }

    private MediaType getMediaTypeFromExt(String path) {
        return Optional
            .ofNullable(MEDIA_TYPE_MAP.get(StringUtils.getFilenameExtension(path)))
            .orElse(MediaType.APPLICATION_OCTET_STREAM);
    }
}
