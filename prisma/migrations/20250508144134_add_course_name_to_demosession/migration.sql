/*
  Warnings:

  - Added the required column `courseName` to the `DemoSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DemoSession" ADD COLUMN     "courseName" TEXT NOT NULL;
