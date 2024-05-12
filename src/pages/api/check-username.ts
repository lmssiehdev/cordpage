import type { APIRoute } from "astro";
import { User, db, eq } from "astro:db";
import { z } from "zod";

export const POST: APIRoute = async ({ request, locals }) => {
  // if (!locals.user?.id) {
  //   return new Response(
  //     JSON.stringify({
  //       error: { message: "Unauthorized" },
  //     }),
  //     { status: 401 }
  //   );
  // }

  const body = await request.json();

  const regex = /^[a-zA-Z0-9_]*$/;
  const bodySchema = z.object({
    username: z
      .string()
      .trim()
      .min(3, {
        message: "Username must be at least 3 characters.",
      })
      .refine((value) => regex.test(value), {
        message: `Usernames may only contain letters, numbers, underscores ("_") and periods (".")`,
      }),
  });

  const response = bodySchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;

    return new Response(
      JSON.stringify({
        result: "fail",
        message: errors[0].message,
      }),
      { status: 400 }
    );
  }

  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.username, response.data.username))
    .limit(1);

  if (user)
    return new Response(
      JSON.stringify({
        result: "fail",
        message: "That username is already taken",
      }),
      { status: 200 }
    );

  return new Response(
    JSON.stringify({
      result: "success",
    }),
    { status: 200 }
  );
};
