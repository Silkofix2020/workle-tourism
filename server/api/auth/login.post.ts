import bcrypt from "bcrypt";
import { z } from "zod";
import User from "~/server/models/User";

const bodySchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(event, bodySchema.parse);
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({
      status: 401,
      message: "Неправильный логин или пароль",
    });
  }

  await setUserSession(event, {
    user: { id: user._id.toString(), username, email: user.email },
  });
  return {
    user: { id: user._id.toString(), username, email: user.email },
  };
});
