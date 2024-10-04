import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as todoService from "../services/todoService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("todos.eta", {
      todos: await todoService.listTodos(c.user.id),
    }),
  );
};

const showTodo = async (c) => {
  const id = c.req.param("id");
  return c.html(
    eta.render("todo.eta", {
      todo: await todoService.getTodo(c.user.id, id),
    }),
  );
};

/*The accessControllMiddleware limits the access to the createTodo
function only to authenticated users, and the addUserToContextMiddleware
adds the user to the context, from which we can retrieve the user and it's 
property.
*/  
const createTodo = async (c) => {
  const body = await c.req.parseBody();
  await todoService.createTodo(c.user.id, body);
  return c.redirect("/todos");
};

const updateTodo = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  await todoService.updateTodo(c.user.id, id, body);
  return c.redirect(`/todos/${id}`);
};

const deleteTodo = async (c) => {
  const id = c.req.param("id");
  await todoService.deleteTodo(c.user.id, id);
  return c.redirect("/todos");
};

export { createTodo, deleteTodo, showForm, showTodo, updateTodo };