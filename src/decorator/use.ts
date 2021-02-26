import { RequestHandler } from 'express';
import { CrowllerController, LoginController } from '../controller';

//创建绑定中间件的装饰器
//扩展支持多个中间件修饰
export function use(middleware: RequestHandler) {
  return function (target: CrowllerController | LoginController, key: string) {
    const originMiddeware = Reflect.getMetadata('middlewares', target, key) || [];
    originMiddeware.push(middleware);
    Reflect.defineMetadata('middlewares', originMiddeware, target, key);
  };
}
