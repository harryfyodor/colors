# Colors

基于React-Express的单页面应用（时间管理工具）。地址：[Colors](https://colors.harryfyodor.tk)

## 功能
1. 完整用户注册登录功能（注册，自动登录，邮件激活，更改密码，忘记密码）
2. 记录下特定时间内所做的事，方便将来进行总结。
3. 有排行榜，历史记录，用户设置等功能。

## 使用方法
1. 新建名字为color的mongodb数据库，开启。
2. 在项目根目录下使用`npm install` 安装依赖。
3. 在项目根目录下使用`npm start`开启。
4. 若要尝试部署需要使用`export NODE_ENV=production`。

## 相关技术
* 前端：React—Redux-Saga。
* 后端：Express-mongodb-Co。
* 部分繁琐的异步都用Promise和Generator改写成同步形式。
* 优化：使用了Webpack的Code-split，压缩，等功能。

## 计划
* 用Semantic-UI优化UI。
* 在历史里面添加更多的图表样式。
* 增加历史里面的编辑功能。
* 增加历史里面的标签选择功能。
* 用户的事件允许用markdown格式。
* 完善用户体系，增加用户头像，用户自我描述等等。
* 根据用户当前的等级允许用户选择不同的UI。
* 找到bug，debug & debug & debug!
* 完善测试！（刚开始接触...）

## 灵感来源
[代表日本的250中颜色](http://nipponcolors.com)
