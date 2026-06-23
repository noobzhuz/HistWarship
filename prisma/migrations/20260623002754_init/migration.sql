-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ShipType" AS ENUM ('BATTLESHIP', 'CRUISER', 'DESTROYER', 'FRIGATE', 'CORVETTE', 'AIRCRAFT_CARRIER', 'SUBMARINE', 'AMPHIBIOUS_SHIP', 'MINESWEEPER', 'TRAINING_SHIP', 'SAILING_WARSHIP', 'MISSILE_BOAT', 'OTHER');

-- CreateEnum
CREATE TYPE "OpenStatus" AS ENUM ('OPEN', 'TEMPORARILY_CLOSED', 'EXTERIOR_ONLY', 'MEMORIAL_ONLY', 'CLOSED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PreservationStatus" AS ENUM ('PRESERVED', 'PARTIALLY_PRESERVED', 'RESTORATION', 'DISPLAY_ONLY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('DISCUSSION', 'ARTICLE', 'TRIP_REPORT');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_MORE_INFO');

-- CreateEnum
CREATE TYPE "EditTargetType" AS ENUM ('SHIP', 'MUSEUM_SITE', 'NEW_SHIP', 'NEW_MUSEUM_SITE');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" UUID NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumSite" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "officialWebsite" TEXT,
    "wikipediaUrl" TEXT,
    "sourceNotes" TEXT,
    "description" TEXT,
    "visitorInfo" TEXT,
    "accessibilityNotes" TEXT,
    "visitDurationMinutes" INTEGER,
    "openStatus" "OpenStatus" NOT NULL DEFAULT 'UNKNOWN',
    "statusNote" TEXT,
    "statusUpdatedAt" TIMESTAMP(3),
    "expectedReopenDate" TIMESTAMP(3),
    "expectedReopenText" TEXT,
    "statusSourceUrl" TEXT,
    "heroImageUrl" TEXT,
    "galleryImages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuseumSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "alternateNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hullNumber" TEXT,
    "shipClass" TEXT,
    "type" "ShipType" NOT NULL,
    "typeLabel" TEXT,
    "nation" TEXT,
    "country" TEXT,
    "launchedYear" INTEGER,
    "commissionedYear" INTEGER,
    "decommissionedYear" INTEGER,
    "preservationStatus" "PreservationStatus" NOT NULL DEFAULT 'UNKNOWN',
    "openStatus" "OpenStatus" NOT NULL DEFAULT 'UNKNOWN',
    "statusNote" TEXT,
    "statusUpdatedAt" TIMESTAMP(3),
    "expectedReopenDate" TIMESTAMP(3),
    "expectedReopenText" TEXT,
    "statusSourceUrl" TEXT,
    "overview" TEXT,
    "whyVisit" TEXT,
    "history" TEXT,
    "technicalInfo" JSONB,
    "visitorNotes" TEXT,
    "officialWebsite" TEXT,
    "wikipediaUrl" TEXT,
    "sourceNotes" TEXT,
    "heroImageUrl" TEXT,
    "galleryImages" JSONB,
    "siteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "PostType" NOT NULL DEFAULT 'DISCUSSION',
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "authorId" UUID NOT NULL,
    "shipId" TEXT,
    "siteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "authorId" UUID NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditProposal" (
    "id" TEXT NOT NULL,
    "targetType" "EditTargetType" NOT NULL,
    "targetId" TEXT,
    "title" TEXT,
    "summary" TEXT,
    "payload" JSONB NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerNote" TEXT,
    "submittedById" UUID NOT NULL,
    "reviewedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "EditProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToPostTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToPostTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuseumSite_slug_key" ON "MuseumSite"("slug");

-- CreateIndex
CREATE INDEX "MuseumSite_country_idx" ON "MuseumSite"("country");

-- CreateIndex
CREATE INDEX "MuseumSite_city_idx" ON "MuseumSite"("city");

-- CreateIndex
CREATE INDEX "MuseumSite_latitude_longitude_idx" ON "MuseumSite"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Ship_slug_key" ON "Ship"("slug");

-- CreateIndex
CREATE INDEX "Ship_name_idx" ON "Ship"("name");

-- CreateIndex
CREATE INDEX "Ship_country_idx" ON "Ship"("country");

-- CreateIndex
CREATE INDEX "Ship_nation_idx" ON "Ship"("nation");

-- CreateIndex
CREATE INDEX "Ship_type_idx" ON "Ship"("type");

-- CreateIndex
CREATE INDEX "Ship_shipClass_idx" ON "Ship"("shipClass");

-- CreateIndex
CREATE INDEX "Ship_siteId_idx" ON "Ship"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_type_idx" ON "Post"("type");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");

-- CreateIndex
CREATE INDEX "Post_shipId_idx" ON "Post"("shipId");

-- CreateIndex
CREATE INDEX "Post_siteId_idx" ON "Post"("siteId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_name_key" ON "PostTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_slug_key" ON "PostTag"("slug");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "EditProposal_targetType_targetId_idx" ON "EditProposal"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "EditProposal_status_idx" ON "EditProposal"("status");

-- CreateIndex
CREATE INDEX "EditProposal_submittedById_idx" ON "EditProposal"("submittedById");

-- CreateIndex
CREATE INDEX "EditProposal_reviewedById_idx" ON "EditProposal"("reviewedById");

-- CreateIndex
CREATE INDEX "_PostToPostTag_B_index" ON "_PostToPostTag"("B");

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "MuseumSite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "MuseumSite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditProposal" ADD CONSTRAINT "EditProposal_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditProposal" ADD CONSTRAINT "EditProposal_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostTag" ADD CONSTRAINT "_PostToPostTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostTag" ADD CONSTRAINT "_PostToPostTag_B_fkey" FOREIGN KEY ("B") REFERENCES "PostTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
