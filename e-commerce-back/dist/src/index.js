/** Entry point that starts the Express server. */
import app from "./app.controller.js";
import { dataBaseConnection } from "./database/connection.js";
import { env } from "../config/env.service.js";
/** Starts the Express HTTP server and connects to the database in parallel */
app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
dataBaseConnection();
//# sourceMappingURL=index.js.map