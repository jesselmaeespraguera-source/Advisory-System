import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const url = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ''),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create Programs
  const programs = [];

  for (let i = 0; i < 3; i++) {
    const program = await prisma.program.create({
      data: {
        name: faker.helpers.arrayElement([
          'BS Information Technology',
          'BS Computer Science',
          'BS Information Systems',
        ]),
      },
    });

    programs.push(program);
  }

  // Create Students
  for (let i = 0; i < 20; i++) {
    const program = faker.helpers.arrayElement(programs);

    await prisma.student.create({
      data: {
        name: faker.person.fullName(),
        programId: program.id,
      },
    });
  }

  // Create Advisers
  for (const program of programs) {
    await prisma.adviser.create({
      data: {
        name: faker.person.fullName(),
        programId: program.id,
      },
    });
  }

  // Create Subjects
  for (const program of programs) {
    for (let i = 0; i < 3; i++) {
      await prisma.subject.create({
        data: {
          description: faker.helpers.arrayElement([
            'Database Management',
            'Web Development',
            'Data Structures',
            'Programming',
            'Computer Networks',
            'Software Engineering',
          ]),
          programId: program.id,
        },
      });
    }
  }

  // Get students for remarks
  const students = await prisma.student.findMany();

  // Create Remarks
  for (const student of students) {
    await prisma.remark.create({
      data: {
        studentId: student.id,
        content: faker.helpers.arrayElement([
          'Good academic performance.',
          'Needs improvement in programming.',
          'Shows good participation in class.',
          'Should improve attendance.',
          'Performing well in the subject.',
        ]),
        category: faker.helpers.arrayElement([
          'academic',
          'attendance',
          'behavior',
          'performance',
        ]),
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });