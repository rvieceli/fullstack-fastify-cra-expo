import { PrismaClient, Prisma } from "@prisma/client";

const database = new PrismaClient();


export { Prisma, database };
