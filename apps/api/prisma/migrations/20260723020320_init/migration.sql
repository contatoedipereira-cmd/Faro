-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "segment" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "googleRating" DOUBLE PRECISION,
    "googleReviews" INTEGER,
    "hasWebsite" BOOLEAN NOT NULL DEFAULT false,
    "hasInstagram" BOOLEAN NOT NULL DEFAULT false,
    "hasFacebook" BOOLEAN NOT NULL DEFAULT false,
    "hasWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "employeesEstimate" TEXT,
    "revenueRange" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_segment_idx" ON "companies"("segment");

-- CreateIndex
CREATE INDEX "companies_city_idx" ON "companies"("city");
