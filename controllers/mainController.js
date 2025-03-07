import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as sessionService from "../services/sessionService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showMain = async (c) => {
  return c.html(eta.render("main.eta", {
    user: await sessionService.getUserFromSession(c),
  }));
};

export { showMain };