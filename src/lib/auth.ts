import { Discord } from "arctic";
import { db, Session, User } from "astro:db";
import { Lucia } from "lucia";
import { AstroDBAdapter } from "lucia-adapter-astrodb";

export interface DatabaseUser {
  id: string;
  username: string;
  discord_id: string;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}

const adapter = new AstroDBAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      discordId: attributes.discord_id,
    };
  },
});

export const discord = new Discord(
  import.meta.env.DISCORD_CLIENT_ID,
  import.meta.env.DISCORD_SECRET_ID,
  `${import.meta.env.ASTRO_URL}/login/discord/callback`
);
