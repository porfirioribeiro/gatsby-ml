const { basename, dirname, relative, join, sep } = require('path');
const chokidar = require('chokidar');
const fs = require('fs');
const crypto = require('crypto');
const reporter = require('gatsby-cli/lib/reporter');
const pluginName = require('../package.json').name;

function createPageNode({ createNode, file, pagesPath, templatesPath, id }) {
  const filename = basename(file, '.json');
  const relativeDirectory = relative(pagesPath, dirname(file));
  const relativePath = filename === 'index' ? relativeDirectory : join(relativeDirectory, filename);
  const defaultDir = join(relativeDirectory, filename);

  /** @type {{languages: string[], paths?: {[lang:string]: string}, components?: string[]}} */
  const data = Object.assign(
    {
      template: defaultDir,
      page: defaultDir.replace(sep, '_'),
    },
    require(file)
  );

  if (!data.languages) {
    return reporter.panic(`${pluginName}: missing languages: [] ${file}`);
  }

  const template = join(templatesPath, data.template);
  const paths = data.languages.reduce(
    (acc, lang) => ({
      ...acc,
      [lang]: acc[lang] || `/${lang}${relativePath ? `/${relativePath}` : ''}`,
    }),
    data.paths || {}
  );

  const meta = {
    ...data,
    file,
    paths,
    relativePath,
    template,
  };

  const content = fs.readFileSync(file).toString();

  createNode({
    id,
    parent: null,
    children: [],
    internal: {
      type: 'I18nPage',
      contentDigest: crypto
        .createHash(`md5`)
        .update(content)
        .digest(`hex`),
      content,
    },
    meta,
  });
}

const GLOB = '**/*.json';

module.exports = ({ createNode, createNodeId, pagesPath, templatesPath }) => {
  const createPageNodeAction = file =>
    createPageNode({ createNode, file, pagesPath, templatesPath, id: createNodeId(file) });
  const watcher = chokidar
    .watch(`${pagesPath}/${GLOB}`)
    .on('add', createPageNodeAction)
    .on('change', createPageNodeAction)
    .on('unlink', createPageNodeAction);

  return new Promise(resolve => watcher.on('ready', resolve));
};
