## 项目概述
Word Master 是一个智能背单词应用，提供用户管理、单词学习、AI助手等功能。

## 基础信息
+ **基础URL**: `http://localhost:8080`
+ **数据格式**: JSON
+ **字符编码**: UTF-8

---

## 1. 用户管理接口
### 1.1 检查用户名是否存在
**接口地址**: `GET /api/user/check`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | String | 是 | 用户名 |


**响应示例**:

```json
{
    "exists": true
}
```

### 1.2 用户登录
**接口地址**: `POST /api/user/login`

**请求体**:

```json
{
    "username": "testuser",
    "password": "123456"
}
```

**响应示例**:

```json
{
    "success": true,
    "userId": 1,
    "username": "testuser"
}
```

### 1.3 用户注册
**接口地址**: `POST /api/user/register`

**请求体**:

```json
{
    "username": "newuser",
    "password": "123456"
}
```

**响应示例**:

```json
{
    "success": true,
    "msg": "注册成功"
}
```

### 1.4更新用户信息
接口地址：

| `POST` | `/api/user/update-info` |
| --- | --- |


**请求示例 (同时修改用户名和密码)**

```plain
{
    "id": 1001,
    "oldPassword": "user_current_pass",
    "newPassword": "user_new_pass",
    "newUsername": "new_user_name"
}
```

**成功响应示例**

```plain
{
    "code": 200,
    "msg": "用户信息修改成功",
    "passwordUpdated": true,
    "passwordMsg": "密码修改成功",
    "usernameUpdated": false,
    "usernameMsg": "未尝试修改用户名"
}
```

## 2. 单词词汇接口
### 2.1 根据等级获取单词
**接口地址**: `GET /api/vocabulary/words`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| level | String | 是 | 单词等级 (level4/level6) |


**响应示例**:

```json
{
    "code": 200,
    "msg": "单词获取成功",
    "data": [
        {
            "id": 1,
            "word": "abandon",
            "phonetic": "/əˈbændən/",
            "meaning": "放弃；抛弃",
            "example": "He abandoned his car.",
            "level": "level4"
        }
    ]
}
```

### 2.2 随机获取单词
**接口地址**: `GET /api/vocabulary/random`

**请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| level | String | 是 | - | 单词等级 |
| limit | Integer | 否 | 10 | 获取数量 |


**响应示例**:

```json
{
    "code": 200,
    "msg": "随机单词获取成功",
    "data": [
        {
            "id": 1,
            "word": "abandon",
            "phonetic": "/əˈbændən/",
            "meaning": "放弃；抛弃",
            "level": "level4"
        }
    ]
}
```

### 2.3 搜索单词
**接口地址**: `GET /api/vocabulary/search`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| keyword | String | 是 | 搜索关键词 |


**响应示例**:

```json
{
    "code": 200,
    "msg": "搜索结果获取成功",
    "data": [
        {
            "word": "abandon",
            "phonetic": "/əˈbændən/",
            "meaning": "放弃；抛弃",
            "level": "LEVEL4"
        }
    ]
}
```

---

## 3. 学习记录接口
### 3.1 记录单词学习
**接口地址**: `POST /api/learning/record/learn`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |
| wordId | Integer | 是 | 单词ID |
| isCorrect | Boolean | 是 | 是否认识该单词 |
| wordLevel | String | 是 | 单词等级 |


**响应示例**:

```json
{
    "code": 200,
    "msg": "单词学习记录已保存",
    "data": null
}
```

### 3.2 获取学习记录列表
**接口地址**: `GET /api/learning/record/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |


**响应示例**:

```json
{
    "code": 200,
    "msg": "学习记录获取成功",
    "data": [
        {
            "id": 1,
            "userId": 1,
            "wordId": 1,
            "level": "level4",
            "status": "learning",
            "learnDate": "2024-01-15",
            "proficiency": 50.0,
            "correctCount": 2,
            "incorrectCount": 1,
            "lastReviewDate": "2024-01-15T10:30:00",
            "createdAt": "2024-01-15T09:00:00",
            "updatedAt": "2024-01-15T10:30:00"
        }
    ]
}
```

### 3.3 获取今日复习单词
**接口地址**: `GET /api/learning/record/today-review`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |


**响应示例**:

```json
{
    "code": 200,
    "msg": "复习单词获取成功",
    "data": [
        {
            "id": 1,
            "word": "abandon",
            "phonetic": "/əˈbændən/",
            "meaning": "放弃；抛弃",
            "level": "level4"
        }
    ]
}
```

### 3.4 更新复习状态
**接口地址**: `POST /api/learning/record/review`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |
| wordId | Integer | 是 | 单词ID |
| reviewResult | Boolean | 是 | 复习结果 |


**响应示例**:

```json
{
    "code": 200,
    "msg": "复习状态已更新",
    "data": null
}
```

### 3.5 更新拼写状态
**接口地址**: `POST /api/learning/record/spelling`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |
| wordId | Integer | 是 | 单词ID |
| spellingResult | Boolean | 是 | 拼写结果 |


**响应示例**:

```json
{
    "code": 200,
    "msg": "拼写状态已更新",
    "data": null
}
```

### 3.6 获取错误单词
**接口地址**: `GET /api/learning/record/error-words`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |


**响应示例**:

```json
{
    "code": 200,
    "msg": "错误单词获取成功",
    "data": [
        {
            "id": 1,
            "word": "abandon",
            "phonetic": "/əˈbændən/",
            "meaning": "放弃；抛弃",
            "level": "level4"
        }
    ]
}
```

### 3.7 获取用户统计数据
**接口地址**: `GET /api/learning/record/stats-summary`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userId | Integer | 是 | 用户ID |


**响应示例**:

```json
{
    "code": 200,
    "msg": "用户统计数据获取成功",
    "data": {
        "totalLearned": 150,
        "todayLearnedWords": 10,
        "streakDays": 7,
        "level4Count": 100,
        "level6Count": 50,
        "learningCount": 200,
        "reviewCount": 150,
        "spellingCount": 80
    }
}
```

<font style="color:rgb(0, 0, 0);"></font>

### <font style="color:rgb(0, 0, 0);">3.8删除单词本中的单词记录</font>
+ **<font style="color:rgb(0, 0, 0) !important;">返回结果示例</font>**<font style="color:rgba(0, 0, 0, 0.85);">：</font>
+ **<font style="color:rgb(0, 0, 0) !important;">成功响应</font>**<font style="color:rgb(0, 0, 0);">（记录存在且删除成功）：</font>**<font style="color:rgba(0, 0, 0, 0.85);">json</font>**

```json
{
  "success": true,
  "msg": "单词已从单词本中删除",
  "data": null
}
```

+ **<font style="color:rgb(0, 0, 0) !important;">失败响应 1</font>**<font style="color:rgb(0, 0, 0);">（记录不存在）：</font>**<font style="color:rgba(0, 0, 0, 0.85);">json</font>**

```json
{
  "success": false,
  "msg": "删除失败：未找到用户ID=1、单词ID=101的学习记录",
  "data": null
}
```

+ **<font style="color:rgb(0, 0, 0) !important;">失败响应 2</font>**<font style="color:rgb(0, 0, 0);">（数据库异常）：</font>**<font style="color:rgba(0, 0, 0, 0.85);">json</font>**

```json
{
  "success": false,
  "msg": "删除失败：数据库连接超时，请稍后重试",
  "data": null
}
```

## 4. AI助手接口
### 4.1 AI聊天
**接口地址**: `POST /api/ai/chat`

**请求体**:

```json
{
    "message": "请解释一下abandon这个单词的用法"
}
```

**响应示例**:

```json
{
    "reply": "abandon是一个动词，意思是'放弃、抛弃'。常用搭配有abandon oneself to（沉溺于）、abandon hope（放弃希望）等。"
}
```

---

## 5. 搜索接口
### 5.1 搜索单词
**接口地址**: `GET /api/search/words`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| keyword | String | 是 | 搜索关键词 |


**响应示例**:

```json
[
    {
        "word": "abandon",
        "phonetic": "/əˈbændən/",
        "meaning": "放弃；抛弃",
        "level": "LEVEL4"
    }
]
```

---

## 6. 统一响应格式
### 成功响应
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {}
}
```

### 错误响应
```json
{
    "code": 500,
    "msg": "操作失败",
    "data": null
}
```

---

## 7. 错误码说明
| 错误码 | 说明 |
| --- | --- |
| 200 | 成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |


---

## 8. 注意事项
1. 熟练度范围为 0-100
2. 单词等级支持 level4 和 level6

