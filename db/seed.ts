import { db, Comment, User } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Comment).values([
    {
      username: "lmssieh",
      description: "something unique",
      status: "online",
      avatar_url:
        "https://cdn.discordapp.com/avatars/1056973007437971497/f5b449cacb3f3afd9ef3ee849d3b1257.webp",
    },
  ]);

  await db.insert(User).values([
    {
      id: "12ren59rgqr4tj1w",
      discord_id: "11056973007437971497",
      username: "fromseed",
      avatar: "f5b449cacb3f3afd9ef3ee849d3b1257",
      global_name: "preacher",
      banner: "",
      banner_color: "#614429",
      email: "lmssieh@proton.me",
      verified: true,
      description: "",
      links: [
        {
          id: "0",
          name: "Youtube",
          link: "https://youtube.com/",
        },
        {
          id: "1",
          name: "Github",
          link: "https://github.com/",
        },
        {
          id: "2",
          name: "Facebook",
          link: "https://facebook.com/",
        },
      ],
    },
  ]);
}
