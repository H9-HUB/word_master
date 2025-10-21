package com.example.word_master.service.impl;

import com.example.word_master.entity.UserLearningRecord;
import com.example.word_master.entity.WordVocabulary;
import com.example.word_master.dto.UserStatsSummary;
import com.example.word_master.mapper.UserLearningRecordMapper;
import com.example.word_master.mapper.WordVocabularyMapper;
import com.example.word_master.service.UserLearningRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserLearningRecordServiceImpl implements UserLearningRecordService {

    @Autowired
    private UserLearningRecordMapper recordMapper;

    @Autowired
    private WordVocabularyMapper wordVocabularyMapper;

    @Override
    public void upsertRecord(UserLearningRecord record) {
        recordMapper.upsertRecord(record);
    }

    @Override
    public List<UserLearningRecord> getByUserId(Integer userId) {
        return recordMapper.selectByUserId(userId);
    }

    @Override
    public UserLearningRecord getByUserAndWord(Integer userId, Integer wordId) {
        return recordMapper.selectByUserAndWord(userId, wordId);
    }

    @Override
    public List<WordVocabulary> getTodayReviewWords(Integer userId) {
        List<UserLearningRecord> records = recordMapper.selectNeedReview(userId, LocalDateTime.now());
        if (records.isEmpty()) {
            return Collections.emptyList();
        }
        List<Integer> wordIds = records.stream()
                .map(UserLearningRecord::getWordId)
                .collect(Collectors.toList());
        return wordVocabularyMapper.selectBatchIds(wordIds);
    }

    @Override
    public List<WordVocabulary> getErrorWords(Integer userId) {
        List<UserLearningRecord> errorRecords = recordMapper.selectErrorRecords(userId);
        if (errorRecords.isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> wordIds = errorRecords.stream()
                .map(UserLearningRecord::getWordId)
                .collect(Collectors.toList());

        return wordVocabularyMapper.selectBatchIds(wordIds);
    }

    @Override
    public UserStatsSummary getUserStatsSummary(Integer userId) {
        UserStatsSummary summary = new UserStatsSummary();

        // 1. 基础统计
        summary.setTotalLearned(recordMapper.countTotalUniqueWords(userId));
        summary.setTodayLearnedWords(recordMapper.countTodayUniqueWords(userId));
        summary.setLevel4Count(recordMapper.countUniqueWordsByLevel(userId, "level4"));
        summary.setLevel6Count(recordMapper.countUniqueWordsByLevel(userId, "level6"));

        // 2. 连续学习天数
        List<LocalDate> distinctLearnDates = recordMapper.selectDistinctLearnDates(userId);
        int streakDays = calculateStreakDays(distinctLearnDates);
        summary.setStreakDays(streakDays);

        // 3. 学习/复习/拼写次数统计
        // 初次学习的单词数 (correctCount + incorrectCount 都为 0 的记录)
        int learningCount = recordMapper.countFirstTimeLearning(userId);

        // 复习总次数 = 所有 correctCount 的总和
        int reviewCorrect = recordMapper.countTotalReviewCorrect(userId);
        int reviewIncorrect = recordMapper.countTotalReviewIncorrect(userId);
        int reviewCount = reviewCorrect + reviewIncorrect;

        summary.setLearningCount(learningCount);
        summary.setReviewCount(reviewCount);
        summary.setSpellingCount(0);  // 暂时设为 0，如需精确统计需在表中添加操作类型字段

        return summary;
    }

    // 辅助函数：计算连续学习天数
    private int calculateStreakDays(List<LocalDate> distinctLearnDates) {
        if (distinctLearnDates == null || distinctLearnDates.isEmpty()) {
            return 0;
        }

        distinctLearnDates.sort(Collections.reverseOrder());

        LocalDate today = LocalDate.now();
        int currentStreak = 0;

        boolean learnedToday = distinctLearnDates.contains(today);
        LocalDate checkDate = today;

        if (learnedToday) {
            currentStreak = 1;
            checkDate = today.minusDays(1);
        } else {
            checkDate = today.minusDays(1);
        }

        while (distinctLearnDates.contains(checkDate)) {
            currentStreak++;
            checkDate = checkDate.minusDays(1);
        }

        return currentStreak;
    }

    @Override
    public void deleteWordFromNotebook(Integer userId, Integer wordId) {
        recordMapper.deleteByUserAndWord(userId, wordId);
    }
}