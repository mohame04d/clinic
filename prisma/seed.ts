import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const mockDoctors = [
    {
      email: 'doctor1@clinic.com',
      name: 'Dr. Adam Smith',
      specialty: 'Cardiology',
      bio: 'Expert cardiologist with 15 years of experience.',
      location: 'Floor 3, Clinic Center',
      rating: 4.8,
    },
    {
      email: 'doctor2@clinic.com',
      name: 'Dr. Emily Chen',
      specialty: 'Pediatrics',
      bio: 'Compassionate pediatrician specializing in early childhood development.',
      location: 'Floor 2, Clinic Center',
      rating: 4.9,
    },
    {
      email: 'doctor3@clinic.com',
      name: 'Dr. Michael Johnson',
      specialty: 'Neurology',
      bio: 'Board-certified neurologist focusing on innovative treatments.',
      location: 'Floor 4, Clinic Center',
      rating: 4.7,
    },
    {
      email: 'doctor4@clinic.com',
      name: 'Dr. Sarah Williams',
      specialty: 'Dermatology',
      bio: 'Experienced dermatologist treating various skin, hair, and nail conditions.',
      location: 'Floor 1, Clinic Center',
      rating: 5.0,
    },
  ];

  console.log(`Seeding database with ${mockDoctors.length} mock doctors...`);
  console.log(`Universal Passwords for all doctors: ${plainPassword}\n`);

  for (const doc of mockDoctors) {
    const doctorUser = await prisma.user.upsert({
      where: { email: doc.email },
      update: {
        password: hashedPassword,
        role: 'DOCTOR',
        active: true,
      },
      create: {
        email: doc.email,
        name: doc.name,
        password: hashedPassword,
        role: 'DOCTOR',
        active: true,
        doctor: {
          create: {
            specialty: doc.specialty,
            bio: doc.bio,
            location: doc.location,
            rating: doc.rating,
          },
        },
      },
    });
    
    console.log(`Seeded: ${doc.name} (${doc.email}) - ${doc.specialty}`);
  }

  console.log('\nAll mock doctors successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
