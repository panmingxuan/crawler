import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller('/')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  //登录方法
  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    //通过双非逻辑符号来让isLogin类型推断出是boolean类型
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData(false, '已经登陆过了'));
    } else {
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, '登陆失败'));
      }
    }
  }

  //退出登录方法
  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  //主页方法
  @get('/')
  home(req: BodyRequest, res: Response): void {
    //通过双非逻辑符号来让isLogin类型推断出是boolean类型
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.send(`
        <html>
        <body>
          <a href='/getData'>爬取内容</a>
          <a href='/showData'>展示内容</a>
          <a href='/logout'>退出</a>
        </body>
      </html>
    `);
    } else {
      res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password"  name="password" />
            <button>登录</button>
          </form>
        </body>
      </html>
    `);
    }
  }
}
