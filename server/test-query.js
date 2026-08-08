import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    console.log('Testing Prisma query...');
    const result = await prisma.doctorVerification.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            accountType: true,
            profile: { select: { wilaya: true } }
          }
        }
      },
      orderBy: { submittedAt: 'asc' }
    });
    console.log('Query successful. Rows:', result.length);
  } catch (err) {
    console.error('Query failed:', err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
