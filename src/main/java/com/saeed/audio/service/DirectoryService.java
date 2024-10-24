package com.saeed.audio.service;

import com.saeed.audio.model.DirectoryResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static java.util.Collections.emptyList;
import static org.springframework.util.StringUtils.getFilenameExtension;

@Service
@Slf4j
public class DirectoryService {

    private static final Set<String> SUPPORTED_EXT = Set.of("mp3", "wav", "ogg");

    public DirectoryResponse getFilesFromMusicDirectory() {
        final String directory = System.getProperty("user.home") + File.separator + "Music";
        final Path path = Path.of(directory);

        if (!path.toFile().exists()) {
            return null;
        }

        try (Stream<Path> paths = Files.walk(path)) {
            List<String> audioPaths = paths
                .filter(Files::isRegularFile)
                .filter(this::isSupportedExtension)
                .map(Path::toFile)
                .map(File::getAbsolutePath)
                .toList();
            return new DirectoryResponse(directory, audioPaths);
        } catch (IOException e) {
            log.error("Error walking music directory: dir={} msg={}", directory, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private boolean isSupportedExtension(Path path) {
        return Optional.ofNullable(getFilenameExtension(path.toString()))
                .stream()
                .anyMatch(SUPPORTED_EXT::contains);
    }
}
