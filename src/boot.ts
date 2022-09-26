import { Controllers } from "./controllers";
import { data_source } from "./db";
import { app } from "./web";

export const main = async () => {
  await data_source.initialize();

  app.use(Controllers);
  app.listen(3000);
};
