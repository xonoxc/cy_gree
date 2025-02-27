-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Client', 'Agent');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('Andhra_Pradesh', 'Arunachal_Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal_Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya_Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil_Nadu', 'Telangana', 'Tripura', 'Uttar_Pradesh', 'Uttarakhand', 'West_Bengal', 'Andaman_and_Nicobar_Islands', 'Chandigarh', 'Dadra_and_Nagar_Haveli_and_Daman_and_Diu', 'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu_and_Kashmir');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Claimed', 'Collected');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('Gift_Coupon', 'Cash', 'Offer');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('Recycler', 'Eco_Warrior', 'Green_Ambassador', 'Sustainability_Hero');

-- CreateEnum
CREATE TYPE "ImportanceLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL DEFAULT '',
    "role" "Role" NOT NULL DEFAULT 'Client',
    "address" TEXT,
    "city" TEXT,
    "state" "State",
    "country" TEXT NOT NULL DEFAULT 'India',
    "phoneNumber" VARCHAR(10),
    "totalPlasticRecycled" DECIMAL(20,2) NOT NULL DEFAULT 0.00,
    "earnedPoints" DECIMAL(20,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlasticCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "claimedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlasticCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListReward" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100),
    "pointsRequired" DECIMAL(30,2) NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardType" "RewardType" NOT NULL,

    CONSTRAINT "ListReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "claimedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" "BadgeType" NOT NULL DEFAULT 'Recycler',
    "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toUserId" TEXT,
    "message" TEXT NOT NULL,
    "importanceLevel" "ImportanceLevel" NOT NULL DEFAULT 'Low',
    "notificationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_userId_rewardId_key" ON "Reward"("userId", "rewardId");

-- CreateIndex
CREATE INDEX "Notification_importanceLevel_notificationDate_idx" ON "Notification"("importanceLevel", "notificationDate" DESC);

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlasticCollection" ADD CONSTRAINT "PlasticCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "ListReward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
