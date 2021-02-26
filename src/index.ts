import express from 'express';
import './controller/LoginController';
import './controller/CrowllerController';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import router from './router';

//使用express
const app = express();

//使用body-parser 持久req.body
app.use(bodyParser.urlencoded({ extended: false }));

//对req或者res进行修改的时候，req或res的类型定义并不能进行实时改变
//使用custom.d.ts扩充，进行声明合并（Declaration Merging）
// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.teacherName = 'dell';
//   next();
// });

//cookie-session 状态的持久存储
app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher dell'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

//启用路由规则
app.use(router);

//服务启动的端口
app.listen(7001, () => {
  console.log('server is running');
});
