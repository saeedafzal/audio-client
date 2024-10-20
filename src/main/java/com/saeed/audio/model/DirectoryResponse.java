package com.saeed.audio.model;

import java.util.List;

public record DirectoryResponse(
    String directory,
    List<String> audioPaths
) {}
