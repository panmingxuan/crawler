import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import singleDellAnalyzer from './singleDellAnalyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json');

  //获取html页面内容
  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  //写入文件
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  //爬虫工具的入口
  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}
const secret = 'x3b174jsx';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
const analyzer = singleDellAnalyzer.getInstance();
new Crowller(url, analyzer);
