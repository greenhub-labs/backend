import { PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: Roles.OWNER, description: 'Propietario: acceso total' },
    {
      name: Roles.ADMINISTRATOR,
      description: 'Administrador: gestión completa excepto eliminación',
    },
    { name: Roles.MANAGER, description: 'Gestor: control operativo' },
    { name: Roles.VIEWER, description: 'Observador: solo lectura' },
    { name: Roles.GUEST, description: 'Invitado: acceso limitado' },
    { name: Roles.SYSTEM, description: 'Administrador del sistema' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description,
      },
    });
  }
  console.log('Roles seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
