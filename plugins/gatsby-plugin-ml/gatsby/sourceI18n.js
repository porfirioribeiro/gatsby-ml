const { basename, dirname } = require('path');
const chokidar = require('chokidar');
const fs = require('fs');
const crypto = require('crypto');

function createI18nNode({ createNode, file, id }) {
  const info = {
    file,
    language: basename(file, '.json'),
    name: basename(dirname(file)),
    group: basename(dirname(dirname(file))),
  };

  const content = fs.readFileSync(file).toString();

  createNode({
    id,
    parent: null,
    children: [],
    internal: {
      type: 'I18n',
      contentDigest: crypto
        .createHash(`md5`)
        .update(content)
        .digest(`hex`),
      content,
    },
    ...info,
  });
}

const GLOB = '**/*.json';

module.exports = ({ createNode, createNodeId, i18nPath }) => {
  const createI18nNodeAction = file => createI18nNode({ createNode, file, id: createNodeId(file) });
  const watcher = chokidar
    .watch(`${i18nPath}/${GLOB}`)
    .on('add', createI18nNodeAction)
    .on('change', createI18nNodeAction)
    .on('unlink', createI18nNodeAction);

  return new Promise(resolve => watcher.on('ready', resolve));
};
