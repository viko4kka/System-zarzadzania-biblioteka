-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "joindate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_Admin" BOOLEAN NOT NULL DEFAULT false,
    "is_Banned" BOOLEAN NOT NULL DEFAULT false,
    "is_Removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id_loan" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "copy_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id_loan")
);

-- CreateTable
CREATE TABLE "Copy" (
    "id_copy" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "is_loan" BOOLEAN NOT NULL DEFAULT false,
    "is_actual" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Copy_pkey" PRIMARY KEY ("id_copy")
);

-- CreateTable
CREATE TABLE "Book" (
    "id_book" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cover" TEXT NOT NULL,
    "ISBN" TEXT NOT NULL,
    "publisher_id" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id_book")
);

-- CreateTable
CREATE TABLE "book_author" (
    "id_book_author" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "book_author_pkey" PRIMARY KEY ("id_book_author")
);

-- CreateTable
CREATE TABLE "Author" (
    "id_author" SERIAL NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_lastname" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id_author")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id_publisher" SERIAL NOT NULL,
    "publisher_name" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id_publisher")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "book_author_book_id_author_id_key" ON "book_author"("book_id", "author_id");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_copy_id_fkey" FOREIGN KEY ("copy_id") REFERENCES "Copy"("id_copy") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Copy" ADD CONSTRAINT "Copy_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id_publisher") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id_author") ON DELETE RESTRICT ON UPDATE CASCADE;
