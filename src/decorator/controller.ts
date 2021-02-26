import router from '../router';
import { Methods } from './request';
import { RequestHandler } from 'express';

//生成路由的类装饰器
export function controller(root: string) {
  return function (target: new (...args: any[]) => any) {
    for (let key in target.prototype) {
      const path: string = Reflect.getMetadata('path', target.prototype, key);
      const method: Methods = Reflect.getMetadata('method', target.prototype, key);
      //扩展支持多个中间件修饰
      const middlewares: RequestHandler[] = Reflect.getMetadata('middlewares', target.prototype, key);
      const handler = target.prototype[key];
      if (path && method) {
        //过滤控制器传入的根路径
        const fullPath = root === '/' ? path : `${root}${path}`;
        if (middlewares && middlewares.length) {
          router[method](fullPath, ...middlewares, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  };
}
