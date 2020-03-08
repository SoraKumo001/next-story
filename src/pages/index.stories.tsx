import { storiesOf } from "@storybook/react";
import Page from "./index";
import Page02 from "./page02";
import { apolloDecorator } from "../storybook/ApolloDecorator";
import App from "./_app";
console.log(process.env)
storiesOf("Pages", module)
  .addDecorator(apolloDecorator)
  .add("index", () => {
    return <Page />;
  })
  .add("page02", () => {
    return <Page02 />;
  });


  // storiesOf("Test", module)
  // .add("index", () => {
  //   return <App><Page /></App>;
  // })
