// Import statements, ensuring types are imported as well (if available)
import app from "./server";
import config from "./config";
import { errorHandler } from "./middlewares/error.middleware";

app.listen(process.env.PORT, () => {
  console.log(
    `Server ${config.APPNAME} running on port ${config.PORT}, http://localhost:${config.PORT}/`
  );
});

app.use(errorHandler);
