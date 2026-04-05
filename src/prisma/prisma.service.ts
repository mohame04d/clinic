import "dotenv/config";

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Hardcoded للاختبار (هنشيله بعد ما يشتغل)
    const connectionString = "postgresql://postgres:mYBedSArjKGekMzevVdTNtAiAfIVLWbt@junction.proxy.rlwy.net:36077/railway?sslmode=no-verify";

    console.log("🔥 Prisma using connection:", connectionString);

    const adapter = new PrismaPg({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      },
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log("✅ Prisma Connected Successfully to Railway");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}