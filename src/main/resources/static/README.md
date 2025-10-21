【单词大师-智能背单词】项目说明
### 一、项目概述
开发一个类似百词斩的背单词Web应用，提供多种学习模式和完整的用户体验。

### 二、项目结构

```
Word_Master/ 
├── .idea/ 
│   ├── compiler.xml 
│   ├── encodings.xml 
│   ├── misc.xml 
│   ├── modules.xml 
│   └── workspace.xml 
└── Word_Master/ 
	├── .idea/ 
	│   ├── misc.xml 
	│   └── workspace.xml 
	├── HELP.md 
	├── pom.xml 
	├── src/ 
	│   └── main/ 
	│       ├── .obsidian/ 
	│       │   └── workspace.json 
	│       ├── java/ 
	│       │   └── com/ 
	│       │       └── example/ 
	│       │           └── word_master/ 
	│       │               ├── WordMasterApplication.java 
	│       │               ├── dto/ 
	│       │               │   ├── ChatRequest.java 
	│       │               │   ├── UserStatsSummary.java 
	│       │               │   ├── WordSearchResultDTO.java 
	│       │               │   └── ChatResponse.java 
	│       │               └── entity/ 
	│       │               │   ├── User.java 
	│       │               │   ├── UserLearningRecord.java 
	│       │               │   └── WordVocabulary.java 
	│       │               └── common/ 
	│       │               │   └── Result.java 
	│       │               └── controller/ 
	│       │               │   ├── UserController.java
	│       │               │   ├── UserLearningRecordController.java
	│       │               │   ├── WordSearchController.java
	│       │               │   ├── WordVocabularyController.java
	│       │               │   └── AIController.java 
	│       │               └── util/ 
	│       │               │   └── PasswordEncoderUtil.java 
	│       │               └── mapper/ 
	│       │               │   ├── UserMapper
	│       │               │   ├── WordVocabularyMapper
	│       │               │   └── UserLeaningRecordMapper 
	│       │               └── service/ 
	│       │               │   └── impl/
	│       │               │   │   ├── UserLearningRecordSerceImpl
	│       │               │   │   ├── UserServiceImpl 
	│       │               │   │   ├── WordSearchServiceImpl 
	│       │               │   │   └── WodVocabularyServiceImpl   
	│       │               │   ├── AIService.java
	│       │               │   ├── UserLearningRecordService
	│       │               │   ├── UserService
	│       │               │   ├── WordSearchService
	│       │               │   └── WordVocabularyService
	│       └── resources/ 
	│           ├── mapper/
	│           │   └── stats.html 
	│           └── static/ 
	│               ├── images/ 
	│               │   └── avatar.png
	│               ├── JS/ 
	│               │   ├── learning.js 
	│               │   ├── main.js 
	│               │   ├── review.js 
	│               │   ├── ai-tutor.js 
	│               │   ├── search-results.js 
	│               │   └── spelling.js 
	│               ├── README.md 
	│               ├── ai-tutor.html    //AI 问答页面，提供单词相关咨询
	│               ├── index.html       //用户登录 / 注册页面
	│               ├── level-select.html //词库选择页面
	│               ├── learning.html    //学习模式，展示单词并记录学习状态
	│               ├── main.html        //应用主页，提供功能入口
	│               ├── notebook.html    //单词本管理页面，管理不认识的单词
	│               ├── review.html      //复习模式页面
	│               ├── search-result.html  //单词查询结果页面
	│               ├── spelling.html    //拼写测试页面
	│               └── stats.html      //学习统计页面，展示学习进度和成果
	└── target/ 
		└── classes/ 
			└── static/ 
				├── JS/ 
				│ ├── learning.js 
				│ ├── review.js 
				│ └── spelling.js 
				└── README.md
```
### 三、更新部分
#### 1. 将原来的main.js拆分
- 将不同功能拆分到 JS 目录下，与html文件相对应，使可读性增强
#### 2. 建立后端数据库
- 建立数据库word_master
- 建立三张表：
	- user(用户数据)，
	- user_learning_record(学习过的词汇)，
	- word_vocabulary(本地导入的单词数据)
- 登陆时：
	- 若用户已存在，校对密码是否正确，若正确则登录，若不正确则提示密码错误；
	- 若用户不存在，则将该用户的用户名和密码加到user表中
- 学习模式下：学习的词汇通过word_vocabulary表导入，支持选择不同等级的词汇本进行学习（四级、六级）
- 用户通过学习模式学习的单词，自动加到数据库的user_learning_record表中
- 复习模式和拼写模式下：调用user_learning_record表中的单词数据进行复习和拼写
- 储存当日学习的所有数据
#### 3. 改变学习统计界面逻辑
- 第一块
	- 今日已学 = 今日学习的单词数
	- 累计学习 = 该用户所有的学习单词数
	- 单词本 = 单词本中实际单词数
	- 连续天数 = 用户连读登录学习的天数
- 第二块
	- 今日目标进度和学习成就中的每日目标 和 学习模式关联
	- 词汇达人 = 累计学习单词数
	- 坚持不懈 = 连续天数
- 第三块
	- 学习趋势图和每日学习数相关联
- 第四块
	- 词汇等级分布和学习的数据相关联
	- 学习模式统计和相应模块相关联
#### 4. 增加查询单词功能
- 首页的导航栏处新增搜索条，可以查询单词
	- 中文 ->英文
	- 英文->中文
#### 5. 增加AI伙伴模块
- 首页更多功能处增加AI伙伴入口
- 可向AI进行提问
#### 6. 增加用户头像
- 首页导航栏处增加用户头像
- 改头像为默认（若要用户自己更换，可扩展）
#### 7. 修改用户信息
- 点击头像即可修改用户名密码

### 四、核心功能
#### 1. 用户认证
- 支持账号密码登录系统
- 保存用户学习记录和进度
#### 2. 三大学习功能
#### 学习模式
- 顶部显示今日学习进度 (n/10)
- 中央展示单词、音标和词义
- 底部提供 "认识" 和 "不认识" 按钮
- 不认识的单词自动加入单词本
#### 复习模式
- 仅复习当日学习过的单词
- 展示单词并提供 4 个选项 (1 个正确 + 3 个干扰项)
- 选择后提供即时反馈 (正确显示绿色，错误显示正确答案)
- 完成后显示复习结果和正确率
#### 拼写测试
- 仅测试当日学习过的单词
- 显示词义，隐藏单词和音标
- 提供输入框供用户拼写
- 正确则自动进入下一个，错误则显示正确答案并要求重新拼写
#### 3.  单词管理
- 单词分类：四级、六级，每类由外部导入数据库，数据量充足
- 单词本功能：
    - 自动收集不认识的单词
    - 展示单词、音标和词义
    - 支持从单词本中移除单词
#### 4. 进度跟踪
- 每日 10 个单词学习目标
- 实时学习进度计数
- 单词记忆状态跟踪
- 详细学习统计展示
#### 5. 用户体验优化
- 支持深色模式 / 浅色模式切换
- 集成 Web Speech API 实现单词发音
- 响应式设计，适配不同设备
#### 6. 单词查询
- 支持中文查询英文
- 支持英文查询中文
- 可查询出所有有关联的单词
#### 7. AI问答
- 首页有AI伙伴对话入口
- 连接大模型，可与AI对话查询
### 技术栈
- 前端：HTML、CSS、JavaScript
- 样式框架：Tailwind CSS
- 动画效果：anime.js
- 后端：Spring Boot 
- 数据库访问：MySQL