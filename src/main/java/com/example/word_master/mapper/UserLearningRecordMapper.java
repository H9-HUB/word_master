package com.example.word_master.mapper;

import com.example.word_master.entity.UserLearningRecord;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserLearningRecordMapper {

    @Select("SELECT * FROM user_learning_record " +
            "WHERE user_id = #{userId} " +
            "AND last_review_date <= #{reviewBefore} " +
            "ORDER BY proficiency ASC , last_review_date ASC")
    List<UserLearningRecord> selectNeedReview(@Param("userId") Integer userId,
                                              @Param("reviewBefore") java.time.LocalDateTime reviewBefore);

    // 新增或更新记录
    @Insert("INSERT INTO user_learning_record " +
            "(user_id, word_id, level, status, learn_date, proficiency, " +
            "correct_count, incorrect_count, last_review_date, created_at, updated_at) " +
            "VALUES " +
            "(#{userId}, #{wordId}, #{level}, #{status}, #{learnDate}, #{proficiency}, " +
            "#{correctCount}, #{incorrectCount}, #{lastReviewDate}, #{createdAt}, #{updatedAt}) " +
            "ON DUPLICATE KEY UPDATE " +
            "level = VALUES(level), " +
            "status = VALUES(status), " +
            "learn_date = VALUES(learn_date), " +
            "proficiency = VALUES(proficiency), " +
            "correct_count = VALUES(correct_count), " +
            "incorrect_count = VALUES(incorrect_count), " +
            "last_review_date = VALUES(last_review_date), " +
            "updated_at = VALUES(updated_at)")
    void upsertRecord(UserLearningRecord record);

    // 根据用户ID和单词ID查询记录
    @Select("SELECT * FROM user_learning_record " +
            "WHERE user_id = #{userId} AND word_id = #{wordId}")
    UserLearningRecord selectByUserAndWord(@Param("userId") Integer userId, @Param("wordId") Integer wordId);

    // 根据用户ID查询所有学习记录
    @Select("SELECT * FROM user_learning_record WHERE user_id = #{userId}")
    List<UserLearningRecord> selectByUserId(@Param("userId") Integer userId);

    // 查询用户的错误记录（错误次数多的单词）
    @Select("SELECT * FROM user_learning_record " +
            "WHERE user_id = #{userId} " +
            "AND incorrect_count > correct_count " +
            "ORDER BY incorrect_count DESC")
    List<UserLearningRecord> selectErrorRecords(@Param("userId") Integer userId);

    // 统计查询方法

    // 获取总学习单词数
    @Select("SELECT COUNT(DISTINCT word_id) FROM user_learning_record WHERE user_id = #{userId}")
    Integer countTotalUniqueWords(@Param("userId") Integer userId);

    // 获取今日学习单词数
    @Select("SELECT COUNT(DISTINCT word_id) FROM user_learning_record WHERE user_id = #{userId} AND learn_date = CURDATE()")
    Integer countTodayUniqueWords(@Param("userId") Integer userId);

    // 获取各级别学习单词数 (通过 JOIN 关联 word_vocabulary 表获取 level)
    @Select("SELECT COUNT(DISTINCT ulr.word_id) " +
            "FROM user_learning_record ulr " +
            "JOIN word_vocabulary wv ON ulr.word_id = wv.id " +
            "WHERE ulr.user_id = #{userId} AND wv.level = #{level}")
    Integer countUniqueWordsByLevel(@Param("userId") Integer userId, @Param("level") String level);

    // 获取所有学习日期
    @Select("SELECT DISTINCT learn_date FROM user_learning_record WHERE user_id = #{userId} ORDER BY learn_date DESC")
    List<java.time.LocalDate> selectDistinctLearnDates(@Param("userId") Integer userId);

    // 获取总学习记录数
    @Select("SELECT COUNT(*) FROM user_learning_record WHERE user_id = #{userId}")
    Integer countTotalLearningRecords(@Param("userId") Integer userId);
    @Select("SELECT COUNT(*) FROM user_learning_record " +
            "WHERE user_id = #{userId} " +
            "AND correct_count = 0 " +
            "AND incorrect_count = 0")
    Integer countFirstTimeLearning(@Param("userId") Integer userId);

    // 获取复习次数 (所有 correctCount 的总和)
    @Select("SELECT COALESCE(SUM(correct_count), 0) FROM user_learning_record " +
            "WHERE user_id = #{userId}")
    Integer countTotalReviewCorrect(@Param("userId") Integer userId);

    // 获取复习错误次数 (所有 incorrectCount 的总和)
    @Select("SELECT COALESCE(SUM(incorrect_count), 0) FROM user_learning_record " +
            "WHERE user_id = #{userId}")
    Integer countTotalReviewIncorrect(@Param("userId") Integer userId);

    // 获取今日复习记录数 (lastReviewDate 为今天的记录数)
    @Select("SELECT COUNT(*) FROM user_learning_record " +
            "WHERE user_id = #{userId} " +
            "AND DATE(last_review_date) = CURDATE()")
    Integer countTodayReviewRecords(@Param("userId") Integer userId);

    // 删除用户和单词的学习记录
    @Delete("DELETE FROM user_learning_record " +
            "WHERE user_id = #{userId} AND word_id = #{wordId}")
    void deleteByUserAndWord(@Param("userId") Integer userId, @Param("wordId") Integer wordId);
}