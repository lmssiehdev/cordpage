import type { APIRoute } from "astro";
import { User, db, eq } from "astro:db";
import { z } from "zod";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user?.id) {
    return new Response(
      JSON.stringify({
        error: { message: "Unauthorized" },
      }),
      { status: 401 }
    );
  }

  const body = await request.json();

  const bodySchema = z.object({
    global_name: z.string(),
    description: z.string(),
    links: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        link: z.string(),
      })
    ),
    status: z.enum(["ACTIVE", "IDLE", "DO_NO_DISTURB", "INACTIVE"]),
  });

  const response = bodySchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;

    return new Response(
      JSON.stringify({
        error: { message: "Invalid request", errors },
      }),
      { status: 400 }
    );
  }

  const { links, description, global_name } = response.data;

  await db
    .update(User)
    .set({
      global_name: global_name.trim(),
      description,
      links,
    })
    .where(eq(User.id, locals.user.id));

  return new Response(JSON.stringify(response.data), { status: 200 });
};
