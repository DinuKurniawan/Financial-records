import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { buildDefaultCategoriesForUser } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { getFirstErrorMessage, registerSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Payload harus berupa JSON yang valid.",
      },
      {
        status: 400,
      },
    );
  }

  const parsedPayload = registerSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        message: getFirstErrorMessage(parsedPayload.error),
      },
      {
        status: 400,
      },
    );
  }

  const email = parsedPayload.data.email;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      passwordHash: true,
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (existingUser) {
    const hasGoogleAccount = existingUser.accounts.some(
      (account) => account.provider === "google",
    );

    return NextResponse.json(
      {
        message:
          hasGoogleAccount && !existingUser.passwordHash
            ? "Email ini sudah terdaftar lewat Google. Silakan login dengan Google."
            : "Email sudah terdaftar. Silakan login dengan akun yang ada.",
      },
      {
        status: 409,
      },
    );
  }

  const passwordHash = await hash(parsedPayload.data.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: parsedPayload.data.name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await tx.category.createMany({
      data: buildDefaultCategoriesForUser(createdUser.id),
    });

    return createdUser;
  });

  return NextResponse.json(
    {
      message: "Akun berhasil dibuat.",
      user,
    },
    {
      status: 201,
    },
  );
}
