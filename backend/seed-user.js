import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'test@test.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.usuario.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password_hash: hashedPassword,
            },
        });

        console.log(`\n✅ Usuario creado exitosamente:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
    } catch (e) {
        console.error('Error creando usuario:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
