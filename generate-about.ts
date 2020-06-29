
import * as gitRepoInfo from 'git-repo-info';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);
const mkDir = promisify(fs.mkdir);

const readJson = async <T>(filename: string): Promise<T> => {
  const value = await readFile(filename, 'utf8');
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('%s =>', filename, e);
    return null;
  }
}

/**
 * Generate the deployment information for the **about** use case
 */
( async () => {

  const pkg = await readJson<any>('./package.json');
  const git = gitRepoInfo();

  const now = new Date().toISOString();

  const deploy = {
    name: pkg.name,
    title: pkg.title,
    version: pkg.version,
    description: pkg.description,
    author: `${pkg.author.name} <${pkg.author.email}>`,
    commit: git.sha,
    commitDate: git.committerDate || git.authorDate || now,
    branch: git.branch,
    buildDate: now,
  };

  console.info('About\n%s\n', JSON.stringify(deploy, null, 2));

  const dataPath = path.join(__dirname, 'data');
  if (!await exists(dataPath)) {
    await mkDir(dataPath, {recursive: true});
  }

  await writeFile(path.join(dataPath, 'about.json'), JSON.stringify(deploy, null, 2));
})();
