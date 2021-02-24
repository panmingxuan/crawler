interface Result {
  sucesss: boolean;
  errMsg?: string;
  data: any;
}
//构造全局统一返回格式
export const getResponseData = (data: any, errMsg?: string): Result => {
  if (errMsg) {
    return {
      sucesss: false,
      errMsg: errMsg,
      data,
    };
  }
  return {
    sucesss: true,
    data,
  };
};
