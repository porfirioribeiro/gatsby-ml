const chokidar = require('chokidar');
const GLOB = '**/*.json';

module.exports = async (
  { graphql, actions, getNode, loadNodeContent, store },
  { pagesPath },
  doneCb
) => {
  const watcher = chokidar
    .watch(`${pagesPath}/${GLOB}`)
    // .on('add', file => {
    //   console.log('add', file);
    // })
    // .on('change', file => {
    //   console.log('change', file);
    // })
    // .on('unlink', file => {
    //   console.log('unlick', file);
    // })
    .on('ready', doneCb);
};
