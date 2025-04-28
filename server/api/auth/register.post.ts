import bcrypt from "bcrypt";
import { z } from "zod";
import User from "~/server/models/User";

const bodySchema = z.object({
  username: z.string().min(3, { message: "Минимальная длина имени 3 символа" }),
  email: z.string().email({ message: "Некорректный email" }),
  password: z.string().min(8, { message: "Минимальная длина пароля 8 символов" }),
  secretkey: z.string().nonempty({ message: "Ключ не может быть пустым" }),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const { username, email, password, secretkey } = body;

  if (secretkey !== useRuntimeConfig().secretKey) {
    throw createError({
      status: 400,
      message: "Неверный ключ",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: "Этот пользователь уже существует",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, email });
  await user.save();

  await setUserSession(event, {
    user: { id: user._id.toString(), username, email },
  });

  return { message: "Пользователь успешно зарегистрирован", user: { username, email } };
});
