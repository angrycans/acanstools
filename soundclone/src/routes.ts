import { test } from "./controller/home-controller";

export default [
  { path: "/test/:name", type: "get", action: test },

  // { path: "/person/:name", type: "get", action: helloName },
  // { path: "/info", type: "get", action: getPersonInfo },
  // { path: "/post", type: "post", action: postTest },
];
