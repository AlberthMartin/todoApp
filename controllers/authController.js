import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as scrypt from "https://deno.land/x/scrypt@v4.3.4/mod.ts";
import * as userService from "../services/userService.js";
import * as sessionService from "../services/sessionService.js"

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showRegistrationForm = (c) => c.html(eta.render("registration.eta"));

const showLoginForm = (c) => c.html(eta.render("login.eta"));

const registerUser = async (c) => {

    const body = await c.req.parseBody();
    //check if the password and verify password match
    if (body.password !== body.verification) {
      return c.text("The provided passwords did not match.");
    }
    //check if email adress is in use
    const existingUser = await userService.findUserByEmail(body.email);
    if (existingUser) {
        return c.text(`A user with the email ${body.email} already exists.`);
    }

    //create the user
    const user = {
        id: crypto.randomUUID(),
        email: body.email,
        passwordHash: scrypt.hash(body.password), //store the password as a hash
      };
      //Put the user in the database
      await userService.createUser(user);
      //And create a session
      await sessionService.createSession(c, user);

    return c.redirect("/");
  };

  const loginUser = async (c) => {
    const body = await c.req.parseBody();
    console.log(body);
    
    //Finds the user in the database
    const user = await userService.findUserByEmail(body.email);
    //If the user is not found
    if (!user) {
      return c.text(`No user with the email ${body.email} exists.`);
    }
    //Does the password match
    const passwordsMatch = await scrypt.verify(body.password, user.passwordHash);
    if (!passwordsMatch) {
      return c.text(`Incorrect password.`);
    }

    await sessionService.createSession(c, user);
    
    return c.redirect("/");
  };

  const logoutUser = async (c) => {
    await sessionService.deleteSession(c);
    return c.redirect("/");
  };

export { showRegistrationForm, registerUser, showLoginForm, loginUser, logoutUser };