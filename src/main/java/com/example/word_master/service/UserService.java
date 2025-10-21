package com.example.word_master.service;

import com.example.word_master.entity.User;

// 用户服务接口
public interface UserService {

    // 注册新用户
    boolean register(User user);

    // 根据用户名查询用户
    User findByUsername(String username);

    // 更新用户的最后登录时间
    void updateLastLogin(String username);

    // 检查用户名是否已存在
    boolean checkUsername(String username);

    //进行用户信息更改
    int updatePassword(Integer userId, String oldPassword, String newPassword);
    int updateUsername(Integer userId, String newUsername);
}