import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type Department } from "../../types/product";

export const DepartmentService = {
  getDepartments: async () => {
    const departments: Department[] = await prisma.department.findMany({
      select: {
        id: true,
        department: true,
      },
    });

    if (!departments.length) {
      return new ErrorService.NotFoundError("No se encontraron departamentos");
    }

    return departments;
  },
  getDepartment: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const department: Department | null = await prisma.department.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        department: true,
      },
    });

    return department;
  },
};
