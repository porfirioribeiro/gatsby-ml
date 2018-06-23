const fs = require('fs');
const { normalize } = require('path');
const reporter = require('gatsby-cli/lib/reporter');
const pluginName = require('./package.json').name;
const sourceI18n = require('./gatsby/sourceI18n');
const sourcePages = require('./gatsby/sourcePages');

exports.createPages = require('./gatsby/createPages');
exports.createPagesStatefully = require('./gatsby/createPagesStatefully');

exports.sourceNodes = ({ actions, createNodeId }, { i18nPath, pagesPath, templatesPath }) => {
  if (!i18nPath) reporter.panic(`${pluginName} 'options.i18nPath' must be specified.`);
  if (!fs.existsSync(i18nPath))
    reporter.panic(`${pluginName} '${normalize(i18nPath)}' must exist.`);
  if (!pagesPath) reporter.panic(`${pluginName} 'options.pagesPath' must be specified.`);
  if (!fs.existsSync(pagesPath))
    reporter.panic(`${pluginName} '${normalize(pagesPath)}' must exist.`);
  const { createNode } = actions;

  return Promise.all([
    sourceI18n({ createNode, createNodeId, i18nPath }),
    sourcePages({ createNode, createNodeId, pagesPath, templatesPath }),
  ]);
};
