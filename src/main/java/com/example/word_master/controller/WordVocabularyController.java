package com.example.word_master.controller;

import com.example.word_master.common.Result;
import com.example.word_master.dto.WordSearchResultDTO;
import com.example.word_master.entity.WordVocabulary;
import com.example.word_master.service.WordSearchService;
import com.example.word_master.service.WordVocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
@CrossOrigin(origins = "http://localhost:63342")
public class WordVocabularyController {

    @Autowired
    private WordVocabularyService wordVocabularyService; // 注入单词词汇服务

    @Autowired
    private WordSearchService wordSearchService; // 注入单词搜索服务

    // 根据级别获取单词列表
    @GetMapping("/words")
    public Result<List<WordVocabulary>> getWordsByLevel(@RequestParam String level) {
        List<WordVocabulary> words = wordVocabularyService.getWordsByLevel(level); // 根据级别查询单词
        return Result.success(words, "单词获取成功");
    }

    // 随机获取指定级别的单词
    @GetMapping("/random")
    public Result<List<WordVocabulary>> getRandomWords(@RequestParam String level, @RequestParam(defaultValue = "10") int limit) {
        List<WordVocabulary> words = wordVocabularyService.getRandomWordsByLevel(level, limit); // 随机查询单词
        return Result.success(words, "随机单词获取成功");
    }

    // 搜索单词（返回详细结果DTO）
    @GetMapping("/search")
    public Result<List<WordSearchResultDTO>> searchWords(@RequestParam String keyword) {
        List<WordSearchResultDTO> results = wordSearchService.search(keyword); // 调用搜索服务
        return Result.success(results, "单词搜索成功");
    }
}