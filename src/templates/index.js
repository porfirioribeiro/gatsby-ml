import React from "react";
import Helmet from "react-helmet";

import Layout from "../components/Layout";

export default props => {
  const { i18n } = props.pageContext;

  console.log(i18n);

  return (
    <Layout context={props.pageContext}>
      <Helmet title={i18n.page.title} />
      <h1>{i18n.page.title} </h1>
    </Layout>
  );
};
