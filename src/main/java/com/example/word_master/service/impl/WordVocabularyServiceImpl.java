package com.example.word_master.service.impl;

import com.example.word_master.entity.WordVocabulary;
import com.example.word_master.mapper.WordVocabularyMapper;
import com.example.word_master.service.WordVocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WordVocabularyServiceImpl implements WordVocabularyService {
    
    @Autowired
    private WordVocabularyMapper wordVocabularyMapper;
    
    @Override
    public List<WordVocabulary> getRandomWordsByLevel(String level, int limit) {
        return wordVocabularyMapper.getRandomWordsByLevel(level, limit);
    }
    
    @Override
    public List<WordVocabulary> getWordsByLevel(String level) {
        return wordVocabularyMapper.getWordsByLevel(level);
    }
    
    @Override
    public List<WordVocabulary> searchWords(String keyword) {
        return wordVocabularyMapper.searchWords(keyword);
    }
    
    @Override
    public WordVocabulary getWordById(Long id) {
        return wordVocabularyMapper.selectById(id);
    }
}
