import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import Crowller from '../utils/crowller';
import Analyzer from '../utils/analyzer';
import { getResponseData } from '../utils/util';
import { controller, get, use } from './descriptor';
import { Request, Response, NextFunction } from 'express';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

//统一登录校验中间件
const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '请先登录'));
  }
};

@controller
class CrowllerController {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response) {
    const secret = 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Crowller(url, analyzer);
    res.json(getResponseData(true));
  }
  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response) {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf-8');
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, '数据不存在'));
    }
  }
}
