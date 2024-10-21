package com.saeed.audio.controllers;

import com.saeed.audio.model.DirectoryResponse;
import com.saeed.audio.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;

import static org.springframework.util.StringUtils.getFilenameExtension;

@RestController
@RequestMapping("/api/directory")
@RequiredArgsConstructor
@Slf4j
public class DirectoryController {

    private static final Map<String, MediaType> SUPPORTED_MEDIA = Map.of(
        "mp3", MediaType.parseMediaType("audio/mpeg")
    );

    private final DirectoryService directoryService;

    @GetMapping("/music")
    public DirectoryResponse loadMusicDirectory() {
        log.info("Getting audio from $HOME/Music directory...");
        DirectoryResponse response = directoryService.getFilesFromMusicDirectory();
        log.info("Returning files from music directory: count={}", response.audioPaths().size());
        return response;
    }

    @GetMapping("/file")
    public ResponseEntity<Resource> getFile(@RequestParam String path) {
        log.info("Getting file from path: {}", path);
        Resource resource = new FileSystemResource(Paths.get(path).normalize());
        return ResponseEntity.ok()
            .contentType(getMediaTypeFromExt(path))
            .body(resource);
    }

    private MediaType getMediaTypeFromExt(String path) {
        return Optional
            .ofNullable(SUPPORTED_MEDIA.get(getFilenameExtension(path)))
            .orElse(MediaType.APPLICATION_OCTET_STREAM);
    }
}
