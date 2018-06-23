import React from "react";
import { Link } from "gatsby";

export default ({ children, context: { meta, i18n, language } }) => (
  <React.Fragment>
    <header>{i18n.header.title}</header>
    {children}
    <footer>
      {i18n.footer.alsoAvailableIn}
      <ul>
        {meta.languages.filter(lang => lang !== language).map(lang => (
          <li key={lang}>
            <Link to={meta.paths[lang]}>{lang}</Link>
          </li>
        ))}
      </ul>
    </footer>
  </React.Fragment>
);
