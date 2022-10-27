import { randomUUID } from 'node:crypto';
import { readdirSync, statSync } from 'node:fs';
import { parse, resolve } from 'node:path';

const getFileInfo = dir => {
  const tree = createInfo({ dir, type: 'Root' });
  const list = [];
  function fn({ dir, children, deep, parentId, parentName }) {
    deep++;
    const temp = readdirSync(dir, { encoding: 'utf-8' });
    temp.forEach(item => {
      const path = resolve(dir, item);
      const stats = statSync(path);
      if (stats.isFile()) {
        const file = createInfo({
          dir: path,
          type: 'File',
          deep,
          parentId,
          parentName,
        });
        children.push(file);
        list.push({ ...file, path, info: parse(path) });
      } else {
        const directory = createInfo({
          dir: path,
          type: 'Directory',
          deep,
          parentId,
          parentName,
        });
        children.push(directory);
        fn({
          dir: path,
          children: directory.children,
          deep,
          parentId: directory.id,
          parentName: directory.info.name,
        });
      }
    });
  }
  fn({
    dir,
    children: tree.children,
    deep: 0,
  });

  return { tree, list };
};

const createInfo = ({
  dir,
  type,
  deep = 0,
  parentId = '',
  parentName = '',
}) => {
  return {
    id: randomUUID(),
    type,
    deep,
    children: [],
    info: parse(dir),
    parentId,
    parentName,
  };
};

export { getFileInfo };
