module.exports = {
  siteMetadata: {
    title: `My website`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-ml',
      options: {
        i18nPath: `${__dirname}/src/i18n`,
        pagesPath: `${__dirname}/src/pages`,
        templatesPath: `${__dirname}/src/templates`,
      },
    },
  ],
};
