package com.saeed.audio.controllers;

import com.saeed.audio.service.DownloadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/api/download")
@RequiredArgsConstructor
@Slf4j
public class DownloadController {

    private final DownloadService downloadService;

    @GetMapping("/yt-dlp")
    public boolean hasYtDlp() {
        log.info("Checking if yt-dlp exists in PATH.");
        boolean result = downloadService.hasYtDlp();
        log.info("yt-dlp exists: {}", result);
        return result;
    }

    @PostMapping
    public boolean startDownload(@RequestParam(required = false) String out, @RequestParam String url) {
        log.info("Attempting to download audio: out={} url={}", out, url);
        boolean result = downloadService.downloadAudio(out, url);
        log.info("Download success: {}", result);
        return result;
    }
}
