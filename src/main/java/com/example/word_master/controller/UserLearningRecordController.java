package com.example.word_master.controller;
import com.example.word_master.entity.WordVocabulary;
import com.example.word_master.common.Result;
import com.example.word_master.entity.UserLearningRecord;
import com.example.word_master.service.UserLearningRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.word_master.dto.UserStatsSummary;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/learning/record")
@CrossOrigin(origins = "http://localhost:63342")
public class UserLearningRecordController {

    @Autowired
    private UserLearningRecordService recordService; // 注入用户学习记录服务

    // 记录单词学习情况
    @PostMapping("/learn")
    public Result<Void> recordWordLearn(
            @RequestParam Integer userId,
            @RequestParam Integer wordId,
            @RequestParam boolean isCorrect,
            @RequestParam String wordLevel){ // 接收学习参数

        System.out.println("记录单词学习 - 用户ID：" + userId + "，单词ID：" + wordId + "，等级：" + wordLevel + "，是否认识：" + isCorrect);

        // 获取现有记录
        UserLearningRecord record = recordService.getByUserAndWord(userId, wordId);

        if (record == null) {
            // 如果没有记录，创建新记录并初始化计数
            record = new UserLearningRecord();
            record.setUserId(userId);
            record.setWordId(wordId);
            record.setCreatedAt(LocalDateTime.now());
            record.setProficiency(new BigDecimal("20")); // 初始熟练度
            record.setCorrectCount(0);
            record.setIncorrectCount(0);
            record.setLastReviewDate(LocalDateTime.now());
        }

        // 累加计数和更新熟练度
        if (isCorrect) {
            record.setCorrectCount(record.getCorrectCount() + 1);
            BigDecimal newProficiency = record.getProficiency().add(new BigDecimal("30"));
            // 熟练度上限 100
            record.setProficiency(newProficiency.compareTo(new BigDecimal("100")) > 0 ?
                    new BigDecimal("100") : newProficiency);
        } else {
            record.setIncorrectCount(record.getIncorrectCount() + 1);
            BigDecimal newProficiency = record.getProficiency().subtract(new BigDecimal("15"));
            // 熟练度下限 0
            record.setProficiency(newProficiency.compareTo(new BigDecimal("0")) < 0 ?
                    new BigDecimal("0") : newProficiency);
        }

        // 更新公共字段
        record.setLevel(wordLevel); // 赋值单词级别
        record.setStatus(isCorrect ? "mastered" : "learning"); // 更新学习状态
        record.setLearnDate(LocalDate.now()); // 记录今天学习了
        record.setUpdatedAt(LocalDateTime.now());
        record.setLastReviewDate(LocalDateTime.now()); // 记录最后学习时间

        recordService.upsertRecord(record); // 插入或更新记录
        return Result.success("单词学习记录已保存");
    }

    // 根据用户ID查询所有学习记录
    @GetMapping("/list")
    public Result<List<UserLearningRecord>> getLearningRecords(@RequestParam Integer userId) {
        System.out.println("查询学习记录 - 用户ID：" + userId);
        List<UserLearningRecord> records = recordService.getByUserId(userId);
        return Result.success(records, "学习记录获取成功");
    }

    // 根据用户ID和单词ID查询特定记录
    @GetMapping("/get")
    public Result<List<UserLearningRecord>> getRecordByUserAndWord(
            @RequestParam Integer userId,
            @RequestParam Integer wordId) {
        System.out.println("查询特定记录 - 用户ID：" + userId + "，单词ID：" + wordId);
        // 将单个记录封装成列表返回
        List<UserLearningRecord> record = Collections.singletonList(recordService.getByUserAndWord(userId, wordId));
        if (record != null) {
            return Result.success(record, "记录查询成功");
        } else {
            return Result.fail("未找到对应学习记录");
        }
    }


    // 获取用户今日需复习的单词列表
    @GetMapping("/today-review")
    public Result<List<WordVocabulary>> getTodayReviewWords(@RequestParam Integer userId) {
        System.out.println("查询今日复习单词 - 用户ID：" + userId);
        List<WordVocabulary> words = recordService.getTodayReviewWords(userId);
        return Result.success(words, "复习单词获取成功");
    }

    // 更新单词复习状态 (用于复习模式)
    @PostMapping("/review")
    public Result<Void> updateReviewStatus(
            @RequestParam Integer userId,
            @RequestParam Integer wordId,
            @RequestParam boolean reviewResult) {
        System.out.println("更新复习状态 - 用户ID：" + userId + "，单词ID：" + wordId + "，结果：" + reviewResult);
        UserLearningRecord record = recordService.getByUserAndWord(userId, wordId);
        if (record == null) {
            return Result.fail("未找到对应学习记录，无法更新复习状态");
        }
        // 更新时间戳
        record.setLastReviewDate(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());

        if (reviewResult) {
            record.setCorrectCount(record.getCorrectCount() + 1);
            // 熟练度增加 5，上限 100
            BigDecimal newProficiency = record.getProficiency().add(new BigDecimal("30"));
            record.setProficiency(newProficiency.compareTo(new BigDecimal("100")) > 0 ?
                    new BigDecimal("100") : newProficiency);
        } else {
            record.setIncorrectCount(record.getIncorrectCount() + 1);
            // 熟练度减少 10，下限 0
            BigDecimal newProficiency = record.getProficiency().subtract(new BigDecimal("15"));
            record.setProficiency(newProficiency.compareTo(new BigDecimal("0")) < 0 ?
                    new BigDecimal("0") : newProficiency);
        }
        recordService.upsertRecord(record);
        return Result.success("复习状态已更新");
    }

    // 更新单词拼写状态 (用于拼写测试模式)
    @PostMapping("/spelling")
    public Result<Void> updateSpellingStatus(
            @RequestParam Integer userId,
            @RequestParam Integer wordId,
            @RequestParam boolean spellingResult) {

        System.out.println("更新拼写状态 - 用户ID：" + userId + "，单词ID：" + wordId + "，结果：" + spellingResult);
        UserLearningRecord record = recordService.getByUserAndWord(userId, wordId);

        if (record == null) {
            return Result.fail("未找到对应学习记录，无法更新拼写状态");
        }

        // 更新时间戳
        record.setLastReviewDate(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());

        if (spellingResult) {
            record.setCorrectCount(record.getCorrectCount() + 1);
            // 熟练度增加30，上限 100
            BigDecimal newProficiency = record.getProficiency().add(new BigDecimal("30"));
            record.setProficiency(newProficiency.compareTo(new BigDecimal("100")) > 0 ?
                    new BigDecimal("100") : newProficiency);
        } else {
            record.setIncorrectCount(record.getIncorrectCount() + 1);
            // 熟练度减少 15，下限 0
            BigDecimal newProficiency = record.getProficiency().subtract(new BigDecimal("15"));
            record.setProficiency(newProficiency.compareTo(new BigDecimal("0")) < 0 ?
                    new BigDecimal("0") : newProficiency);
        }

        recordService.upsertRecord(record);
        return Result.success("拼写状态已更新");
    }

    // 获取用户的错误单词列表
    @GetMapping("/error-words")
    public Result<List<WordVocabulary>> getErrorWords(@RequestParam Integer userId) {
        System.out.println("查询错误单词 - 用户ID：" + userId);
        List<WordVocabulary> errorWords = recordService.getErrorWords(userId);
        return Result.success(errorWords, "错误单词获取成功");
    }

    // 获取用户统计数据摘要
    @GetMapping("/stats-summary")
    public Result<UserStatsSummary> getStatsSummary(@RequestParam Integer userId) {
        System.out.println("查询用户统计数据 - 用户ID：" + userId);

        UserStatsSummary summary = recordService.getUserStatsSummary(userId); // 获取统计摘要数据

        return Result.success(summary, "用户统计数据获取成功");
    }

    // 删除单词本中的单词记录
    @DeleteMapping("/delete")
    public Result<Void> deleteWordFromNotebook(
            @RequestParam Integer userId,
            @RequestParam Integer wordId) {

        System.out.println("删除单词本记录 - 用户ID：" + userId + "，单词ID：" + wordId);

        try {
            recordService.deleteWordFromNotebook(userId, wordId); // 调用服务执行删除操作
            return Result.success("单词已从单词本中删除");
        } catch (Exception e) {
            System.err.println("删除单词本记录失败: " + e.getMessage());
            return Result.fail("删除单词本记录失败");
        }
    }
}