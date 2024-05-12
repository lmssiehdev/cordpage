import { defineDb, defineTable, column } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    discord_id: column.text(),
    username: column.text(),
    avatar: column.text(),
    global_name: column.text(),
    banner: column.text({
      optional: true,
    }),
    banner_color: column.text(),
    email: column.text(),
    verified: column.boolean(),
    description: column.text(),
    links: column.json({
      default: [],
    }),
    private: column.boolean({
      default: false,
    }),
    status: column.text({
      default: "ACTIVE",
    }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    expiresAt: column.date(),
    userId: column.text({
      references: () => User.columns.id,
    }),
  },
});

const Comment = defineTable({
  columns: {
    username: column.text(),
    description: column.text(),
    avatar_url: column.text(),
    status: column.text(),
  },
});

export default defineDb({
  tables: { Comment, User, Session },
});
