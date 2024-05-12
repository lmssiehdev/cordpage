import { discord, lucia } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import type { APIContext } from "astro";
import { User, db, eq } from "astro:db";
import { generateId } from "lucia";
import { type APIUser } from "discord-api-types/v10";

export async function GET(context: APIContext) {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("discord_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);

    // TODO: Promise All settled
    const discordUserResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const discordUser: DiscordUser = await discordUserResponse.json();

    const [existingUser] = await db
      .select()
      .from(User)
      .where(eq(User.discord_id, discordUser.id))
      .limit(1);

    console.log({ existingUser, discordUser });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return context.redirect("/");
    }

    const userId = generateId(15);

    // TODO: just set optional to true
    await db.insert(User).values({
      id: userId,
      username: discordUser.username ?? "",
      discord_id: discordUser.id ?? "",
      avatar: discordUser.avatar ?? "",
      banner: discordUser.banner ?? "",
      banner_color: discordUser.banner_color ?? "",
      email: discordUser.email ?? "",
      global_name: discordUser.global_name ?? "",
      verified: discordUser.verified ?? true,
      description: "",
      links: [],
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return context.redirect("/");
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

// TODO: infer from db
// export interface DiscordUser {
//   id: string;
//   username: string;
//   avatar: string;
//   global_name: string;
//   banner: null | string;
//   banner_color: string;
//   email: string;
//   verified: true;
//   discord_id: string;
//   description: string;
//   links: Record<"name" | "url", string>[]
// }

export type STATUS = "ACTIVE" | "IDLE" | "DO_NO_DISTURB" | "INACTIVE";

export type DiscordUser = Pick<
  APIUser,
  "banner" | "global_name" | "email" | "verified" | "avatar" | "username"
> & {
  banner_color: string;
  id: string;
  discord_id: string;
  description: string;
  links: Record<"name" | "link" | "id", string>[];
  status: STATUS;
};
