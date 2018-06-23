# gatsby-ml

Trying to figure ou a system to work with multilingual websites

Demo: https://gatsby-ml-sample.surge.sh

## Existing approaches

There are some plugins to work with multilingual content, but most of them are for different markdown/jsx pages.

What i need is more having a single component that gets feed by json files with translation keys and generate different pages/urls for selected languages and allowing to create a simple language switcher

So we will have SSR html for every language generated for you in react

`/pages/index.json`

```json
{
  "languages": ["en", "pt", "es"]
}
```

Will generate pages and html for the languages specified

- `http://some.site/en`
- `http://some.site/pt`
- `http://some.site/es`

Changing the language will update the page in place, no reloading.

## Translations

Translations should be in the form:

- `/i18n/pages/index/en.json`
- `/i18n/pages/index/pt.json`
- `/i18n/pages/index/es.json`
- `/i18n/components/footer/en.json`
- `/i18n/components/footer/pt.json`
- `/i18n/components/footer/es.json`

It will be load and its content passed to the pageContext i18n object as

- `props.pageContext.i18n.page`
- `props.pageContext.i18n.footer`

## Running in development

`gatsby start`

## Current problems
If we change any of the JSON files it won't reload the changed translations.
Even tho createPages is called with the new translations and i call createPage again it wont work because it's cached
