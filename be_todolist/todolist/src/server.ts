// src/server.ts
import app from "./app";  // <--- bỏ .ts

import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
