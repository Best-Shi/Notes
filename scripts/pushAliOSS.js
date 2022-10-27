import OSS from 'ali-oss';
import { normalize } from 'node:path';
import { config } from '../config.js';

const client = new OSS(config.aliOSS);

const { objects } = await client.list();
for (let i = 0; i < objects.length; i++) {
  await client.delete(objects[i].name);
}

const pushAliOSS = async (name, path) => {
  client.put(name, normalize(path));
};

export { pushAliOSS };
