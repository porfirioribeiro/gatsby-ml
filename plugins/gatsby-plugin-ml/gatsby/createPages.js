const path_ = require(`path`);
const reporter = require("gatsby-cli/lib/reporter");
const pluginName = require("../package.json").name;
const isEqual = require("lodash/isEqual");

const resolveData = ({ data, errors }) =>
  errors ? Promise.reject(errors) : Promise.resolve(data);

module.exports = async ({ graphql, actions, getNode, store }) => {
  const { createPage /* createPageDependency */, deletePage } = actions;

  const state = store.getState();
  return graphql(`
    {
      allI18NPage {
        edges {
          node {
            id
          }
        }
      }
    }
  `)
    .then(resolveData)
    .then(async ({ /* site, */ allI18NPage }) => {
      for (const edge of allI18NPage.edges) {
        const meta = getNode(edge.node.id).meta;

        for (const language of meta.languages) {
          graphql(
            `
              query GetI18n($language: String!, $page: String!) {
                components: allI18N(
                  filter: {
                    language: { eq: $language }
                    group: { eq: "components" }
                  }
                ) {
                  edges {
                    node {
                      name
                      internal {
                        content
                      }
                    }
                  }
                }
                page: i18N(
                  language: { eq: $language }
                  group: { eq: "pages" }
                  name: { eq: $page }
                ) {
                  internal {
                    content
                  }
                }
              }
            `,
            {
              language,
              page: meta.page
            }
          )
            .then(resolveData)
            .then(({ page, components }) => {
              if (!page) {
                reporter.panic(
                  `${pluginName} no translations for language '${language}' page: ${
                    meta.file
                  }`
                );
                return;
              }

              let i18n = { page: JSON.parse(page.internal.content) };

              if (components)
                i18n = components.edges.reduce(
                  (acc, { node }) => ({
                    ...acc,
                    [node.name]: JSON.parse(node.internal.content)
                  }),
                  i18n
                );

              const path = meta.paths[language];
              const component = require.resolve(path_.resolve(meta.template));

              const oldPage = state.pages.find(p => p.path === path);

              const newPage = {
                path,
                component,
                context: {
                  i18n,
                  language,
                  meta
                }
              };

              if (oldPage && !isEqual(oldPage.context, newPage.context)) {
                console.log("Delete and recreate page", meta.file, language);

                // deletePage(oldPage);
                // oldPage.context = newPage.context;
              } else {
                console.log("Create page", meta.file, language);
              }

              createPage(newPage);
            });
        }
      }
    });
};
