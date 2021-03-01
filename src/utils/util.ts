interface Result<T> {
  sucesss: boolean;
  errMsg?: string;
  data: any;
}
//构造全局统一返回格式,使用泛型规范data的类型
export const getResponseData = <T>(data: T, errMsg?: string): Result<T> => {
  if (errMsg) {
    return {
      sucesss: false,
      errMsg: errMsg,
      data: data,
    };
  }
  return {
    sucesss: true,
    data,
  };
};
