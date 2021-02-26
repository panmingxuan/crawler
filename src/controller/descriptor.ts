import { RequestHandler, Router } from 'express';

//导出路由
export const router = Router();

enum Method {
  get = 'get',
  post = 'post',
}

//生成路由的类装饰器
export function controller(target: any) {
  for (let key in target.prototype) {
    const path = Reflect.getMetadata('path', target.prototype, key);
    const method: Method = Reflect.getMetadata('method', target.prototype, key);
    const middleware = Reflect.getMetadata('middleware', target.prototype, key);
    const handler = target.prototype[key];
    if (path && method && handler) {
      if (middleware) {
        router[method](path, middleware, handler);
      } else {
        router[method](path, handler);
      }
    }
  }
}
//创建绑定中间件的装饰器
export function use(middleware: RequestHandler) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('middleware', middleware, target, key);
  };
}

//创建绑定请求类型和路径的装饰器
function getRequestDecorator(type: string) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', type, target, key);
    };
  };
}

//生成不同请求的方法装饰器
export const get = getRequestDecorator('get');
export const post = getRequestDecorator('post');
