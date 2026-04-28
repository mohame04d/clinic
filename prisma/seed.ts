import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  // 1. Create Patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@clinic.com' },
    update: { password: hashedPassword, role: 'PATIENT', active: true },
    create: {
      email: 'patient@clinic.com',
      name: 'John Patient',
      password: hashedPassword,
      role: 'PATIENT',
      active: true,
      phone: '123-456-7890',
    },
  });

  console.log(`Seeded Patient: ${patient.name} (${patient.email})`);

  // 2. Mock Doctors
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
  ];

  console.log(`Seeding database with ${mockDoctors.length} mock doctors...`);
  console.log(`Universal Passwords for everyone: ${plainPassword}\n`);

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
      include: { doctor: true },
    });
    
    const doctorId = doctorUser.doctor!.id;

    // Create a schedule for Monday and Tuesday if it doesn't exist
    const existingSchedule = await prisma.daySchedule.findFirst({
      where: { doctorId },
    });

    if (!existingSchedule) {
      await prisma.daySchedule.create({
        data: {
          day: 'MON',
          doctorId,
          timeSlots: {
            create: [
              { start: '09:00', end: '09:30' },
              { start: '09:30', end: '10:00' },
              { start: '10:00', end: '10:30' },
            ]
          }
        }
      });
      await prisma.daySchedule.create({
        data: {
          day: 'TUE',
          doctorId,
          timeSlots: {
            create: [
              { start: '10:00', end: '10:30' },
              { start: '10:30', end: '11:00' },
            ]
          }
        }
      });
    }

    console.log(`Seeded: ${doc.name} and their Schedules`);
  }

  // 3. Create mock Appointments for the patient and doctor1
  const doc1 = await prisma.user.findUnique({ where: { email: 'doctor1@clinic.com' }, include: { doctor: true }});
  
  if (doc1?.doctor) {
    // Delete existing appointments for patient to avoid duplicates on re-seed
    await prisma.appointment.deleteMany({ where: { patientId: patient.id } });

    const now = new Date();
    
    // Past completed appointment (1 week ago)
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - 7);
    
    // Today's upcoming appointment
    const todayApt = new Date(now);
    todayApt.setHours(now.getHours() + 2); // 2 hours from now

    // Tomorrow's appointment
    const tomorrowApt = new Date(now);
    tomorrowApt.setDate(tomorrowApt.getDate() + 1);

    await prisma.appointment.createMany({
      data: [
        {
          patientId: patient.id,
          doctorId: doc1.doctor.id,
          date: pastDate,
          duration: 30,
          status: 'completed',
          notes: 'Routine checkup. Everything looks good.',
        },
        {
          patientId: patient.id,
          doctorId: doc1.doctor.id,
          date: todayApt,
          duration: 30,
          status: 'confirmed',
          notes: 'Follow-up consultation.',
        },
        {
          patientId: patient.id,
          doctorId: doc1.doctor.id,
          date: tomorrowApt,
          duration: 30,
          status: 'pending',
          notes: 'Blood test results discussion.',
        }
      ]
    });
    
    console.log(`Seeded: 3 Appointments for John Patient with Dr. Adam Smith`);
  }

  console.log('\nAll mock data successfully seeded! Run the frontend and login as patient@clinic.com or doctor1@clinic.com to see the dashboards populated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
