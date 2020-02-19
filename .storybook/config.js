import { configure } from "@storybook/react";
configure(require.context("../src/pages", true, /\.stories\.tsx?$/), module);
