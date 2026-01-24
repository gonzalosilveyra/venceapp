-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light';
