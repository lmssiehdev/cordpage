import { generateState } from "arctic";
import { discord } from "./../../../lib/auth";

import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const state = generateState();

  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });

  context.cookies.set("discord_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
