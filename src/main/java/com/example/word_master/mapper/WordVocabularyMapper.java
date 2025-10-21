package com.example.word_master.mapper;

import com.example.word_master.entity.WordVocabulary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WordVocabularyMapper {

    // 根据级别随机获取指定数量的单词（用于学习模式）
    @Select("SELECT * FROM word_vocabulary WHERE level = #{level} ORDER BY RAND() LIMIT #{limit}")
    List<WordVocabulary> getRandomWordsByLevel(@Param("level") String level, @Param("limit") int limit);
    // 根据级别获取该级别的所有单词列表
    @Select("SELECT * FROM word_vocabulary WHERE level = #{level}")
    List<WordVocabulary> getWordsByLevel(@Param("level") String level);
    // 搜索单词：根据关键词（单词或释义）进行模糊匹配，并去重
    @Select("SELECT word, level, phonetic, meaning, example, id " +
            "FROM (" +
            "  SELECT *, " +
            "         ROW_NUMBER() OVER (PARTITION BY word ORDER BY id) AS rn " +
            "  FROM word_vocabulary " +
            "  WHERE word LIKE CONCAT('%', #{keyword}, '%') " +
            "     OR meaning LIKE CONCAT('%', #{keyword}, '%')" +
            ") t " +
            "WHERE rn = 1")
    List<WordVocabulary> searchWords(@Param("keyword") String keyword);
    // 根据 ID 列表批量查询单词（使用 <foreach> 动态 SQL）
    @Select("<script>" +
            "SELECT * FROM word_vocabulary WHERE id IN " +
            "<foreach item='id' collection='ids' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<WordVocabulary> selectBatchIds(@Param("ids") List<Integer> ids);

    WordVocabulary selectById(Long id);
}
