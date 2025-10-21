package com.example.word_master.controller;

import com.example.word_master.entity.User;
import com.example.word_master.service.UserService;
import com.example.word_master.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:63342")
public class UserController {

    @Autowired
    private UserMapper userMapper; // 注入用户 Mapper
    @Autowired
    private UserService userService; // 注入用户 Service

    // 检查用户名是否存在
    @GetMapping("/check")
    public Map<String, Object> checkUsername(@RequestParam String username) {
        Map<String, Object> result = new HashMap<>();
        User user = userService.findByUsername(username); // 通过用户名查询用户
        result.put("exists", user != null); // 判断用户是否存在
        return result;
    }

    // 用户登录, URL: POST /api/user/login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        User dbUser = userMapper.selectByUsername(user.getUsername()); // 根据用户名查询数据库用户
        // 验证密码
        if (dbUser != null && user.getPassword().equals(dbUser.getPassword())) {
            userService.updateLastLogin(user.getUsername()); // 更新最后登录时间
            result.put("success", true);
            result.put("userId", dbUser.getId());
            result.put("username", dbUser.getUsername());
        } else {
            result.put("success", false);
            result.put("msg", "密码错误");
        }
        return result;
    }

    // 用户注册
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        boolean isSuccess = userService.register(user); // 调用注册服务
        result.put("success", isSuccess);
        if (!isSuccess) {
            result.put("msg", "用户名已存在或注册失败");
        }
        return result;
    }

    //用户个人信息修改
    @PostMapping("/update-info")
    public Map<String, Object> updateUserInfo(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("msg", "更新成功");

        Integer userId = (Integer) request.get("userId");
        if (userId == null) {
            result.put("code", 400);
            result.put("msg", "缺少用户ID");
            return result;
        }

        String oldPassword = (String) request.get("oldPassword");
        String newPassword = (String) request.get("newPassword");
        String newUsername = (String) request.get("newUsername");

        //处理密码修改 ---
        if (oldPassword != null && newPassword != null) {
            if (newPassword.trim().isEmpty()) {
                result.put("code", 400);
                result.put("msg", "新密码不能为空");
                return result;
            }

            int status = userService.updatePassword(userId, oldPassword, newPassword);

            if (status == 0) {
                result.put("code", 400);
                result.put("msg", "密码修改失败：原密码错误");
                return result;
            } else if (status == -1) {
                result.put("code", 404);
                result.put("msg", "密码修改失败：用户不存在");
                return result;
            }
            result.put("passwordUpdated", true);
            result.put("passwordMsg", "密码修改成功");
        }

        //  处理用户名修改
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            int status = userService.updateUsername(userId, newUsername);

            if (status == 0) {
                result.put("code", 400);
                result.put("msg", "用户名修改失败：该用户名已被占用");
                return result;
            } else if (status == -1) {
                result.put("code", 404);
                result.put("msg", "用户名修改失败：用户不存在");
                return result;
            }
            result.put("usernameUpdated", true);
            result.put("usernameMsg", "用户名修改成功");
        }

        if (!result.containsKey("passwordUpdated") && !result.containsKey("usernameUpdated")) {
            result.put("code", 400);
            result.put("msg", "请提供要修改的用户名或密码信息");
        } else if (result.containsKey("passwordUpdated") && result.containsKey("usernameUpdated")) {
            result.put("msg", "用户名和密码均修改成功");
        }

        return result;
    }
}