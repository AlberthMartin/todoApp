import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as authController from "./controllers/authController.js";
import * as todoController from "./controllers/todoController.js";
import * as mainController from "./controllers/mainController.js";

import * as middlewares from "./middlewares/middlewares.js";

const app = new Hono();

app.use("*", middlewares.addUserToContextMiddleware);
app.use("/todos/*", middlewares.accessControlMiddleware);

app.get("/auth/login", authController.showLoginForm);
app.get("/auth/registration", authController.showRegistrationForm);

app.post("/auth/registration", authController.registerUser);
app.post("/auth/login", authController.loginUser);
app.post("/auth/logout", authController.logoutUser);


app.get("/todos", todoController.showForm);
app.get("/todos/:id", todoController.showTodo);
app.post("/todos", todoController.createTodo);
app.post("/todos/:id", todoController.updateTodo);
app.post("/todos/:id/delete", todoController.deleteTodo);

app.get("/", mainController.showMain);

export default app;