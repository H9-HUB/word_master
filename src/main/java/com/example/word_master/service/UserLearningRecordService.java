package com.example.word_master.service;

import com.example.word_master.entity.UserLearningRecord;
import com.example.word_master.entity.WordVocabulary;
import java.util.List;
import com.example.word_master.dto.UserStatsSummary;

// 用户学习记录服务接口
public interface UserLearningRecordService {

    // 插入或更新用户的学习记录（幂等操作）
    void upsertRecord(UserLearningRecord record);

    // 根据用户ID获取所有学习记录
    List<UserLearningRecord> getByUserId(Integer userId);

    // 根据用户ID和单词ID获取特定的学习记录
    UserLearningRecord getByUserAndWord(Integer userId, Integer wordId);

    // 获取用户今日需要复习的单词列表
    List<WordVocabulary> getTodayReviewWords(Integer userId);

    // 获取用户的错误单词列表（如掌握度低、错误次数多的）
    List<WordVocabulary> getErrorWords(Integer userId);

    // 获取用户学习统计数据摘要
    UserStatsSummary getUserStatsSummary(Integer userId);

    // 从单词本中删除特定的单词记录
    void deleteWordFromNotebook(Integer userId, Integer wordId);

}