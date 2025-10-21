【单词大师-智能背单词】项目说明
### 一、项目概述
开发背单词Web应用，提供多种学习模式和完整的用户体验。
#### 技术栈
服务器地址：http://localhost:8080
(在后端中也有跨域处理)
#### 技术栈
- 前端：HTML、Tailwind CSS、JavaScript
- 样式框架：Tailwind CSS
- 动画效果：anime.js
- 后端：Spring Boot (详细接口说明在API_Documentation.md)
- 持久层：MyBatis
- 数据库：MySQL（详细见“数据库说明文档”）
- 开发工具：IntelliJ IDEA
前后端
  <img width="2879" height="1715" alt="image" src="https://github.com/user-attachments/assets/84cdda02-9351-4e82-9fbf-9657c592e36c" />
  <img width="2879" height="1715" alt="image" src="https://github.com/user-attachments/assets/4bf0a93a-da65-40ca-a0bd-243c1d190d69" />
   <img width="2879" height="1715" alt="8134476c336485ef8e8b597cc92d51e" src="https://github.com/user-attachments/assets/b4a499c5-4c8c-4612-9085-917ec8e4c32a" />





### 二、项目结构
```
Word_Master/ 
├── .idea/ 
└── Word_Master/ 
	├── .idea/ 
	├── HELP.md 
	├── pom.xml 
	├── src/                                                    
    │   └── main/ 
    │       ├── java/                                         // Java 源代码根目录
    │       │   └── com/ 
    │       │       └── example/ 
    │       │           └── word_master/                      // 项目主包，包含后端业务逻辑
    │       │               ├── WordMasterApplication.java    // 【启动类】
    │       │               ├── dto/                          // 【数据传输对象】用于API请求和响应
    │       │               │   ├── ChatRequest.java          // 接收前端发送的 AI 聊天请求数据（请求体）
    │       │               │   ├── UserStatsSummary.java     // 封装返回给前端的用户统计数据摘要
    │       │               │   ├── WordSearchResultDTO.java  // 封装单词搜索结果数据
    │       │               │   └── ChatResponse.java         // 封装 AI 聊天返回的响应数据
    │       │               └── entity/                       // 【数据库实体】
    │       │               │   ├── User.java                 // 对应用户表 (user)，存储用户信息
    │       │               │   ├── UserLearningRecord.java   // 对应用户学习记录表，存储用户的学习进度和熟练度
    │       │               │   └── WordVocabulary.java       // 对应单词库表，存储单词的基本内容（如英文、释义）
    │       │               └── common/                       // 【公共组件】存放通用的、跨模块依赖的类
    │       │               │   └── Result.java               // 【统一返回封装】用于封装所有 API 响应的统一格式
    │       │               └── controller/                   // 【控制层】
    │       │               │   ├── UserController.java       // 处理用户登录、注册等与用户资源相关的请求
    │       │               │   ├── UserLearningRecordController.java // 处理用户提交学习进度、获取今日复习列表等核心业务请求
    │       │               │   ├── WordSearchController.java // 处理单词搜索请求
    │       │               │   ├── WordVocabularyController.java // 处理单词内容展示和管理请求
    │       │               │   └── AIController.java         // 处理与外部 AI 服务交互的请求
    │       │               └── util/                         // 【工具类】存放通用辅助工具
    │       │               │   └── PasswordEncoderUtil.java  // 用于密码的加密和校验工具
    │       │               └── mapper/                       // 【数据持久层】MyBatis 的 Mapper 接口，直接与数据库交互
    │       │               │   ├── UserMapper                // 负责 User 实体和用户表的操作
    │       │               │   ├── WordVocabularyMapper      // 负责 WordVocabulary 实体和单词内容表的操作
    │       │               │   └── UserLeaningRecordMapper   // 负责 UserLearningRecord 实体和学习记录表的操作
    │       │               └── service/                      // 【业务逻辑层】实现核心业务逻辑，协调 Controller 和 Mapper
    │       │               │   └── impl/                     // 【服务实现】Service 接口的具体实现类
    │       │               │   │   ├── UserLearningRecordSerceImpl // 学习记录服务的具体逻辑
    │       │               │   │   ├── UserServiceImpl       // 用户服务的具体逻辑
    │       │               │   │   ├── WordSearchServiceImpl // 单词搜索的具体逻辑。
    │       │               │   │   └── WodVocabularyServiceImpl  // 单词内容服务的具体逻辑
    │       │               │   ├── AIService.java            // AI 服务接口（可能用于抽象外部API调用）
    │       │               │   ├── UserLearningRecordService // 学习记录服务的接口定义
    │       │               │   ├── UserService               // 用户服务的接口定义
    │       │               │   ├── WordSearchService         // 单词搜索服务的接口定义
    │       │               │   └── WordVocabularyService     // 单词内容服务的接口定义
    │       └── resources/                                  // 资源文件根目录
    │           ├── mapper/                                 // MyBatis 的 XML 配置文件存放目录
    │           │   └── UserMapper.xml                        
    │           └── static/                                 // 给前端的静态文件
    │               ├── images/ 
    │               │   └── avatar.png                      // 默认用户头像图片
    │               │   └── hero-learning.png               //首页图片
    │               ├── JS/                                 // 前端 JavaScript 脚本目录
    │               │   ├── learning.js                     // 学习模式页面的主要交互逻辑（处理单词卡片、进度）
    │               │   ├── main.js                         // 项目主页的初始化和通用逻辑
    │               │   ├── review.js                       // 复习模式页面的交互逻辑
    │               │   ├── ai-tutor.js                     // AI 导师（聊天）页面的交互逻辑
    │               │   ├── search-results.js               // 单词搜索结果页面的交互逻辑
    │               │   └── spelling.js                     // 单词拼写测试等功能的交互逻辑
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
	
```
### 三、更新部分（具体功能需求分析见User_Requirements_Analysis.md）
#### 1. 将原来的main.js拆分
- 将不同功能拆分到 JS 目录下，与html文件相对应，使可读性增强
#### 2. 建立后端数据库
- 建立数据库word_master
- 建立三张表：
    - user(用户表)，
    - user_learning_record(学习记录表)，
    - word_vocabulary(单词表，导入单词数据)
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
- 复习学习过的单词，根据熟练度更新
- 展示单词并提供 4 个选项 (1 个正确 + 3 个干扰项)
- 选择后提供即时反馈 (正确显示绿色，错误显示正确答案)
- 完成后显示复习结果和正确率
#### 拼写测试
- 请写学习过的单词，根据熟练度更新
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
- 调用DeepSeek API，可与AI对话查询
- #### 1. deepseekapi 接口配置
- 项目中涉及的 `deepseekapi` 接口地址因包含敏感信息（如私有域名、密钥参数），已在**代码中注释**。
- 恢复使用步骤：
  1. 找到代码中被注释的 `DEEPSEEK_API_URL` 字段；
  2. 取消注释并替换为实际可用的接口地址（如 `https://你的实际接口地址`）；
