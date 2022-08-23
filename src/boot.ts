import { Controllers } from "./controllers";
import { app } from "./web";

export const main = async () => {
  app.use(Controllers);

  app.listen(3000);
};
