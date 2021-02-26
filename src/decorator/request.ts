import { CrowllerController, LoginController } from '../controller';

//请求类型
export enum Methods {
  get = 'get',
  post = 'post',
}

//创建绑定请求类型和路径的装饰器
function getRequestDecorator(type: Methods) {
  return function (path: string) {
    return function (target: CrowllerController | LoginController, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', type, target, key);
    };
  };
}

//生成不同请求的方法装饰器
export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);
