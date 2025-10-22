-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(250) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "year" INTEGER NOT NULL,
    "author" VARCHAR(250) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
