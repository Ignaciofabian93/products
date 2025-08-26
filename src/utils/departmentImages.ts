/**
 * Utility functions for handling department images
 */

const GATEWAY_BASE_URL = process.env.GATEWAY_URL || "http://localhost:4000";

/**
 * Converts a relative department image path to a full URL
 * @param imagePath - The relative image path (e.g., "/images/departments/electronics.webp")
 * @returns Full URL to the image
 */
export function getDepartmentImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it starts with /, it's a relative path from the gateway
  if (imagePath.startsWith("/")) {
    return `${GATEWAY_BASE_URL}${imagePath}`;
  }

  // Otherwise, assume it's just the filename and needs the full path
  return `${GATEWAY_BASE_URL}/images/departments/${imagePath}`;
}

/**
 * Validates if an image file has a supported format
 * @param filename - The image filename
 * @returns boolean indicating if the format is supported
 */
export function isValidImageFormat(filename: string): boolean {
  const supportedFormats = [".webp", ".jpg", ".jpeg", ".png", ".gif"];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return supportedFormats.includes(extension);
}

/**
 * Gets the department image filename from department name
 * @param departmentName - The name of the department
 * @returns The expected filename for the department image
 */
export function getDepartmentImageFilename(departmentName: string): string {
  // Convert department name to lowercase and replace spaces with empty string
  // to match your naming convention
  const filename = departmentName.toLowerCase().replace(/\s+/g, "");
  return `${filename}.webp`;
}

/**
 * Department name to image filename mapping
 * This ensures consistency between department names and image files
 */
export const DEPARTMENT_IMAGE_MAP: Record<string, string> = {
  Electrohogar: "electronics.webp",
  Entretención: "entertainment.webp",
  "Jardín y Terraza": "garden.webp",
  "Hogar y Decoración": "home.webp",
  "Niños y bebés": "kids.webp",
  "Instrumentos Musicales": "musicalinstruments.webp",
  Mascotas: "pets.webp",
  "Deportes y Outdoor": "sports.webp",
  Tecnología: "technology.webp",
  "Herramientas y Maquinaria": "tools.webp",
  Automotriz: "vehicles.webp",
  "Ropa, Calzado y Accesorios": "wearing.webp",
};
