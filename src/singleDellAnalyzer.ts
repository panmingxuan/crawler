import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller';

//定义course类型
interface Course {
  title: string;
  count: number;
}
interface CourseResult {
  time: number;
  data: Course[];
}
interface Content {
  [propName: number]: Course[];
}
//抽离爬取策略(单例模式)
export default class singleDellAnalyzer implements Analyzer {
  private static instance: singleDellAnalyzer;

  static getInstance() {
    if (!singleDellAnalyzer.instance) {
      singleDellAnalyzer.instance = new singleDellAnalyzer();
    }
    return singleDellAnalyzer.instance;
  }

  //解析html获取course信息
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItem = $('.course-item');
    const courseInfos: Course[] = [];
    courseItem.map((index, element) => {
      const descs = $(element).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split('：')[1]);
      courseInfos.push({ title, count });
    });
    return {
      time: new Date().getTime(),
      data: courseInfos,
    };
  }
  //生成course信息存储文件
  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
