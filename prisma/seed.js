import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
