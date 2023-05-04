package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.app.service.source.SourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/source")
public class SourceController {

    private final SourceService sourceService;

    @GetMapping("download")
    @ResponseBody
    public ResponseEntity<byte[]> downloadResult(@RequestParam Long id) {
        return sourceService.download(id);
    }

    @GetMapping("validate/template")
    @ResponseBody
    public ResponseEntity<byte[]> validateTemplate(@RequestParam Long sourceId) {
        return sourceService.download(sourceId);
    }
}
