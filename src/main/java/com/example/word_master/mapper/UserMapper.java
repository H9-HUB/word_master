package com.example.word_master.mapper;

import com.example.word_master.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    // 根据用户名查询用户 (对应 XML: selectByUsername)
    User selectByUsername(String username);

    // 新增用户 (对应 XML: insert)
    int insert(User user);

    // 更新最后登录时间 (对应 XML: updateLastLogin)
    int updateLastLogin(String username);

    User selectById(Integer id);

    //更新用户信息
    int updatePassword(Integer userId, String oldPassword, String newPassword);
    int updateUsername(User user);
}