import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { marked } from 'marked';
import hljs from 'highlight.js';
import ejs from 'ejs';

import { getFileInfo } from './getFileInfo.js';
import { pushAliOSS } from './pushAliOSS.js';

const basePath = process.cwd();
const docPath = resolve(basePath, 'doc');
const buildPath = resolve(basePath, 'build');
const templatePath = resolve(basePath, 'template');

// 清空build目录
await rmSync(buildPath, { recursive: true, force: true });
await mkdirSync(buildPath);

// 读取所有文件列表
const { tree: fileTree, list: fileList } = getFileInfo(docPath);

// 读取模板
const template = await readFileSync(resolve(templatePath, 'template.ejs'), {
  encoding: 'utf8',
});

for (let i = 0; i < fileList.length; i++) {
  const fileInfo = fileList[i];
  // 读取内容
  const md = await readFileSync(fileInfo.path, {
    encoding: 'utf8',
  });

  // 转成HTML
  const html = marked.parse(md, {
    langPrefix: 'hljs language-',
    async: true,
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  });

  // 写入ejs模板
  const res = ejs.render(template, {
    title: fileInfo.info.name,
    content: html,
    nav: fileTree.children,
  });

  // 写入文件
  await writeFileSync(resolve(buildPath, `${fileInfo.id}.html`), res);
}

// 写入首页
const ejsFile = ejs.render(template, {
  title: 'Best Shi',
  content: '',
  nav: fileTree.children,
});
await writeFileSync(resolve(buildPath, `index.html`), ejsFile);

// 复制公共文件
copyFileSync(
  resolve(templatePath, 'style.css'),
  resolve(buildPath, `style.css`),
);
copyFileSync(
  resolve(templatePath, 'favicon.ico'),
  resolve(buildPath, `favicon.ico`),
);

// 推送到阿里云OSS
const files = await readdirSync(buildPath);
for (let i = 0; i < files.length; i++) {
  await pushAliOSS(files[i], resolve(buildPath, files[i]));
}
