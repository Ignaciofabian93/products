import prisma from "../client/prisma";

const departments = [
  {
    name: "Electrohogar",
    image: "/images/departments/electronics.webp",
  },
  {
    name: "Entretención",
    image: "/images/departments/entertainment.webp",
  },
  {
    name: "Jardín y Terraza",
    image: "/images/departments/garden.webp",
  },
  {
    name: "Hogar y Decoración",
    image: "/images/departments/home.webp",
  },
  {
    name: "Niños y bebés",
    image: "/images/departments/kids.webp",
  },
  {
    name: "Instrumentos Musicales",
    image: "/images/departments/musicalinstruments.webp",
  },
  {
    name: "Mascotas",
    image: "/images/departments/pets.webp",
  },
  {
    name: "Deportes y Outdoor",
    image: "/images/departments/sports.webp",
  },
  {
    name: "Tecnología",
    image: "/images/departments/technology.webp",
  },
  {
    name: "Herramientas y Maquinaria",
    image: "/images/departments/tools.webp",
  },
  {
    name: "Automotriz",
    image: "/images/departments/vehicles.webp",
  },
  {
    name: "Ropa, Calzado y Accesorios",
    image: "/images/departments/wearing.webp",
  },
];

async function seedDepartments() {
  console.log("🌱 Starting department seeding...");

  try {
    // Create or update departments
    for (const dept of departments) {
      const existingDept = await prisma.department.findFirst({
        where: { departmentName: dept.name },
      });

      if (existingDept) {
        // Update existing department with image
        await prisma.department.update({
          where: { id: existingDept.id },
          data: {
            departmentName: dept.name,
            departmentImage: dept.image,
          },
        });
        console.log(`✅ Updated department: ${dept.name}`);
      } else {
        // Create new department
        await prisma.department.create({
          data: {
            departmentName: dept.name,
            departmentImage: dept.image,
          },
        });
        console.log(`✅ Created department: ${dept.name}`);
      }
    }

    console.log("🎉 Department seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding departments:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDepartments().catch((error) => {
    console.error("Failed to seed departments:", error);
    process.exit(1);
  });
}

export { seedDepartments };
