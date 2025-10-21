package com.example.word_master.service;
import com.example.word_master.entity.WordVocabulary;
import java.util.List;
// 单词词汇服务接口
public interface WordVocabularyService {

    // 随机获取指定级别的单词列表
    List<WordVocabulary> getRandomWordsByLevel(String level, int limit);

    // 获取指定级别的所有单词列表
    List<WordVocabulary> getWordsByLevel(String level);

    // 根据关键词搜索单词（返回原始实体）
    List<WordVocabulary> searchWords(String keyword);

    // 根据 ID 获取单个单词的详细信息
    WordVocabulary getWordById(Long id);
}