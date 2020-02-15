import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Page from "./index";
import Page02 from "./page02";

storiesOf('Pages', module)
.add('index', () => {
  return <Page />;
}).add('page02', () => {
  return <Page02 />;
});
