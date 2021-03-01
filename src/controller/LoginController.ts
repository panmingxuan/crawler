import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller('/api')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }
  @get('/isLogin')
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    const result = getResponseData<responseResult.isLogin>(isLogin);
    res.json(result);
  }

  //登录方法
  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    //通过双非逻辑符号来让isLogin类型推断出是boolean类型
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData<responseResult.login>(false, '已经登陆过了'));
    } else {
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData<responseResult.login>(true));
      } else {
        res.json(getResponseData<responseResult.login>(false, '登陆失败'));
      }
    }
  }

  //退出登录方法
  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData<responseResult.logout>(true));
  }
}
