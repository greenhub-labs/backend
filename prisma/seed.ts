import { CropType, PrismaClient, Roles, Season } from '@prisma/client';
import { randomUUID } from 'crypto';

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

  // Seed initial crop varieties
  const cropVarieties = [
    {
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      type: 'VEGETABLE',
      description: 'Popular red fruit vegetable, high yield.',
      averageYield: 6.5,
      daysToMaturity: 75,
      plantingDepth: 1.5,
      spacingBetween: 40,
      waterRequirements: 'medium',
      sunRequirements: 'full',
      minIdealTemperature: 18,
      maxIdealTemperature: 27,
      minIdealPh: 6.0,
      maxIdealPh: 6.8,
      compatibleWith: ['Basil', 'Carrot'],
      incompatibleWith: ['Potato'],
      plantingSeasons: ['SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN'],
    },
    {
      name: 'Carrot',
      scientificName: 'Daucus carota',
      type: 'VEGETABLE',
      description: 'Root vegetable, orange color, sweet flavor.',
      averageYield: 4.0,
      daysToMaturity: 70,
      plantingDepth: 1.0,
      spacingBetween: 5,
      waterRequirements: 'medium',
      sunRequirements: 'full',
      minIdealTemperature: 16,
      maxIdealTemperature: 21,
      minIdealPh: 6.0,
      maxIdealPh: 6.8,
      compatibleWith: ['Tomato', 'Lettuce'],
      incompatibleWith: ['Dill'],
      plantingSeasons: ['SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER', 'AUTUMN'],
    },
    {
      name: 'Strawberry',
      scientificName: 'Fragaria × ananassa',
      type: 'FRUIT',
      description: 'Sweet red fruit, ground cover plant.',
      averageYield: 1.2,
      daysToMaturity: 90,
      plantingDepth: 2.0,
      spacingBetween: 30,
      waterRequirements: 'high',
      sunRequirements: 'full',
      minIdealTemperature: 15,
      maxIdealTemperature: 25,
      minIdealPh: 5.5,
      maxIdealPh: 6.5,
      compatibleWith: ['Spinach', 'Lettuce'],
      incompatibleWith: ['Cabbage'],
      plantingSeasons: ['SPRING'],
      harvestSeasons: ['SUMMER'],
    },
    {
      name: 'Lettuce',
      scientificName: 'Lactuca sativa',
      type: 'VEGETABLE',
      description: 'Leafy green, fast growing, cool season.',
      averageYield: 2.5,
      daysToMaturity: 55,
      plantingDepth: 0.5,
      spacingBetween: 20,
      waterRequirements: 'medium',
      sunRequirements: 'partial',
      minIdealTemperature: 10,
      maxIdealTemperature: 18,
      minIdealPh: 6.0,
      maxIdealPh: 7.0,
      compatibleWith: ['Carrot', 'Radish'],
      incompatibleWith: ['Parsley'],
      plantingSeasons: ['SPRING', 'AUTUMN'],
      harvestSeasons: ['SPRING', 'AUTUMN'],
    },
    {
      name: 'Basil',
      scientificName: 'Ocimum basilicum',
      type: 'HERB',
      description: 'Aromatic herb, companion for tomatoes.',
      averageYield: 0.8,
      daysToMaturity: 60,
      plantingDepth: 0.6,
      spacingBetween: 25,
      waterRequirements: 'medium',
      sunRequirements: 'full',
      minIdealTemperature: 18,
      maxIdealTemperature: 30,
      minIdealPh: 6.0,
      maxIdealPh: 7.5,
      compatibleWith: ['Tomato', 'Pepper'],
      incompatibleWith: ['Rue'],
      plantingSeasons: ['SPRING', 'SUMMER'],
      harvestSeasons: ['SUMMER'],
    },
  ];

  for (const variety of cropVarieties) {
    await prisma.cropVariety.upsert({
      where: { id: randomUUID() },
      update: {},
      create: {
        ...variety,
        type: variety.type as CropType,
        plantingSeasons: variety.plantingSeasons as Season[],
        harvestSeasons: variety.harvestSeasons as Season[],
      },
    });
  }
  console.log('Crop varieties seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
