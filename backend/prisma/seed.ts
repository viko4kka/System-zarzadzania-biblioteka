import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { faker } from '@faker-js/faker'

// Database requirements
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Variables to hash password
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

async function main() {    
    // Add users
    const hashpassword = await bcrypt.hash("haslo1234", SALT_ROUNDS);
    const users = await prisma.user.createManyAndReturn({
        data: Array.from({ length: 50}, () => {
            return {
                mail: faker.internet.email(),
                password: hashpassword,
                name: faker.person.firstName(),
                lastname: faker.person.lastName(),
            };
        }),
        skipDuplicates: true,
        select: { id: true },
    })

    // Add admin and banned user to test
    const admin = await prisma.user.createMany({
        data: [
            {mail: "admin@prisma.io",
            password: hashpassword,
            name: "Karol",
            lastname: "Nowak",
            is_Admin: true,},

            {mail: "test@test.pl",
            password: hashpassword,
            name: "Janusz",
            lastname: "Kowalski",
            is_Banned: true,},

            {mail: "test1@test.pl",
            password: hashpassword,
            name: "Jan",
            lastname: "Nowak",
            is_Removed: true,},

            {mail: "test2@test.pl",
            password: hashpassword,
            name: "Tomasz",
            lastname: "Nienacki",
            is_Banned: true,
            is_Removed: true},
            
        ],
        skipDuplicates: true,
    })

    // Add Publisher
    const publisher = await prisma.publisher.createManyAndReturn({
      data: [
        {publisher_name: "Oficyna PRz"},
        {publisher_name: "PWN"},
        {publisher_name: "Helion"},
      ],
      skipDuplicates: true,
      select: { id_publisher: true },
    }) 

    // Add Author
    const author = await prisma.author.createManyAndReturn({
      data: [
        {author_name: "Mark", author_lastname: "Lutz"},
        {author_name: "Tadeusz", author_lastname: "Kufal"},
        {author_name: "Cay", author_lastname: "Horstmann"},
        {author_name: "Kenneth", author_lastname: "Ross"},
        {author_name: "Charles", author_lastname: "Wright"},
        {author_name: "Ben", author_lastname: "Forta"},
        {author_name: "Allen", author_lastname: "Downey"},
        {author_name: "Brian", author_lastname: "Kernighan"},
        {author_name: "Łukasz", author_lastname: "Sosna"},
        {author_name: "Alfred", author_lastname: "Aho"},
        {author_name: "Monica", author_lastname: "Lam"},
        {author_name: "Ravi", author_lastname: "Sethi"},
        {author_name: "Jeffrey", author_lastname: "Ullman"},
        {author_name: "Parmy", author_lastname: "Olson"},
        {author_name: "Jerzy", author_lastname: "Wawro"},

      ],
      skipDuplicates: true,
      select: { id_author: true },  
    })
    
    // Get publisher list
    const publisher_list = publisher.map(({ id_publisher }) => id_publisher);

    // Add book
    const book = await prisma.book.createManyAndReturn({
        data: [
            {title: "Python. Wprowadzenie", year: 2022, cover: "https://static01.helion.com.pl/global/okladki/vbig/pyth5v.jpg", ISBN: "9788328391703", publisher_id: publisher_list[1]},
            {title: "Ekonometria. Rozwiązywanie problemów z wykorzystaniem programu Gretl", year: 2011, cover: "https://cdn.swiatksiazki.pl/media/catalog/product/9/x/9x99902099690.jpg?width=650&height=650&store=default&image-type=small_image", ISBN: "9788301165130", publisher_id: publisher_list[0]},
            {title: "Java: podstawy", year: 2013, cover: "https://static01.helion.com.pl/global/okladki/vbig/javp13.jpg", ISBN: "9788328930247", publisher_id: publisher_list[1]},
            {title: "Matematyka dyskretna", year: 1996, cover: "https://ecsmedia.pl/c/matematyka-dyskretna-w-zadaniach-p-iext179249592.jpg", ISBN: "9788301143800", publisher_id: publisher_list[0]},
            {title: "SQL w mgnieniu oka. Opanuj język zapytań w 10 minut dziennie", year: 2020, cover: "https://static01.helion.com.pl/global/okladki/vbig/sqlo5v.jpg", ISBN: "9788328394902", publisher_id: publisher_list[1]},
            {title: "Myśl w języku Python! Nauka programowania", year: 2025, cover: "https://static01.helion.com.pl/global/okladki/vbig/myjep3.jpg", ISBN: "9788328919020", publisher_id: publisher_list[1]},
            {title: "Język ANSI C. Programowanie", year: 2025, cover: "https://static01.helion.com.pl/global/okladki/vbig/jansvv.jpg", ISBN: "9788383225562", publisher_id: publisher_list[1]},
            {title: "Linux. Komendy i polecenia", year: 2023, cover: "https://static01.helion.com.pl/global/okladki/vbig/linkp6.jpg", ISBN: "9788328398696", publisher_id: publisher_list[1]},
            {title: "Kompilatory", year: 2019, cover: "https://static01.helion.com.pl/global/okladki/vbig/e_17zq.jpg", ISBN: "9788301203818", publisher_id: publisher_list[1]},
            {title: "Supremacja. Sztuczna inteligencja, ChatGPT i wyścig, który zmieni świat", year: 2025, cover: "https://static01.helion.com.pl/global/okladki/vbig/e_498e.jpg", ISBN: "9788382309102", publisher_id: publisher_list[1]},
            {title: "Identyfikacja i autoryzacja. Poradnik administratora i inżyniera DevOps", year: 2026, cover: "https://static01.helion.com.pl/global/okladki/vbig/idaupa.jpg", ISBN: "9788328935389", publisher_id: publisher_list[1]},
            
        ],
        skipDuplicates: true,
        select: { id_book: true },  
    }) 

    // Get book list
    const book_list = book.map(({ id_book }) => id_book);

    // Get author list
    const author_list = author.map(({ id_author }) => id_author);


    // Link author to book
    await prisma.book.update({
        where: {id_book: book_list[0]},
        data: {authors: {connect: [{id_author: author_list[0]}]}},
    });
    
    await prisma.book.update({
        where: {id_book: book_list[1]},
        data: {authors: {connect: [{id_author: author_list[1]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[2]},
        data: {authors: {connect: [{id_author: author_list[2]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[3]},
        data: {authors: {connect: [{id_author: author_list[3]},
                                   {id_author: author_list[4]},
            ]}},
    });
    
    await prisma.book.update({
        where: {id_book: book_list[4]},
        data: {authors: {connect: [{id_author: author_list[5]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[5]},
        data: {authors: {connect: [{id_author: author_list[6]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[6]},
        data: {authors: {connect: [{id_author: author_list[7]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[7]},
        data: {authors: {connect: [{id_author: author_list[8]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[8]},
        data: {authors: {connect: [{id_author: author_list[9]},
                                   {id_author: author_list[10]},
                                   {id_author: author_list[11]},
                                   {id_author: author_list[12]},
                                ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[9]},
        data: {authors: {connect: [{id_author: author_list[13]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[10]},
        data: {authors: {connect: [{id_author: author_list[14]}]}},
    });


    // Add copy
    const copy = await prisma.copy.createManyAndReturn({
       data: Array.from({ length: 1000}, () => {
            return{        
                book_id: book_list[faker.number.int({min:0, max: book_list.length-1})],
            };
        }),
        skipDuplicates: true,
        select: { id_copy: true },
    }) 

    // Get list of new users and copies
    const user_list = users.map(({ id}) => id);
    const copy_list = copy.map(({ id_copy }) => id_copy);

    // Add loan
    const loan = await prisma.loan.createMany({
        data: Array.from({ length: 1000}, () => {
            const random_start_loan = faker.date.between({from: '2026-01-01', to: '2026-05-01'});
            const random_return_loan = faker.date.between({from: '2026-01-01', to: '2026-05-01'});
            const return_numbers = random_start_loan < random_return_loan ? random_return_loan : null;
            return {
                user_id: user_list[faker.number.int({min: 0, max: user_list.length-1})],
                copy_id: copy_list[faker.number.int({min: 0, max: copy_list.length-1})],
                start_date: random_start_loan,
                return_date: return_numbers,
            };
        }),
        skipDuplicates: true,
    })
    
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
