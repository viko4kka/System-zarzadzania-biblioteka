import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { faker } from '@faker-js/faker'
import { makeHash } from '../src/utils/bcrypt';

// Database requirements
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {    
    // Add users
    const hashpassword = await makeHash("haslo1234");

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
        {publisher_name: "PWN"},
        {publisher_name: "Helion"},
        {publisher_name: "Oficyna PRz"},
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

        //second part 15
        {author_name: "Chip", author_lastname: "Huyen"},
        {author_name: "Adam", author_lastname: "Józefiok"},
        {author_name: "Krzysztof", author_lastname: "Godzisz"},
        {author_name: "Nikola", author_lastname: "Ilic"},
        {author_name: "Ben", author_lastname: "Weissman"},
        {author_name: "Antonio", author_lastname: "Mele"},
        {author_name: "Amar", author_lastname: "Mahmutbegović"},
        {author_name: "Michael", author_lastname: "Albada"},
        {author_name: "Lorne", author_lastname: "Lantz"},
        {author_name: "Daniel", author_lastname: "Cawrey"},
        {author_name: "Kevin", author_lastname: "Mitnick"},
        {author_name: "Willliam", author_lastname: "Simon"},
        {author_name: "Kunal", author_lastname: "Sehgal"},
        {author_name: "Nikolaos", author_lastname: "Thymianis"},

        {author_name: "Adam", author_lastname: "Marciniec"},
        {author_name: "Sławomir", author_lastname: "Samolej"},
        {author_name: "Wojciech", author_lastname: "Rząsa"},
        {author_name: "Dariusz", author_lastname: "Rzońca"},
        {author_name: "Jan", author_lastname: "Sadolewski"},
        {author_name: "Bartosz", author_lastname: "Jędrzejec"},
        {author_name: "Marek", author_lastname: "Gotfryd"},

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
            
            // Secend part 11
            {title: "Inżynieria AI. Tworzenie aplikacji z wykorzystaniem modeli bazowych", year: 2025, cover: "https://static01.helion.com.pl/global/okladki/vbig/inaitw.jpg", ISBN: "9788328926288", publisher_id: publisher_list[1]},
            {title: "CCNA 200-301. Zostań administratorem sieci komputerowych Cisco", year: 2025, cover: "https://static01.helion.com.pl/global/okladki/vbig/cc3012.jpg", ISBN: "9788328931282", publisher_id: publisher_list[1]},
            {title: "Etyczny hacking i testy penetracyjne. Zadbaj o bezpieczeństwo sieci LAN i WLAN", year: 2026, cover: "https://static01.helion.com.pl/global/okladki/vbig/siebel.jpg", ISBN: "9788328938656", publisher_id: publisher_list[1]},
            {title: "Microsoft Fabric od podstaw. Kompleksowe projektowanie nowoczesnej analityki danych", year: 2026, cover: "https://static01.helion.com.pl/global/okladki/vbig/mifaod.jpg", ISBN: "9788328935525", publisher_id: publisher_list[1]},
            {title: "Django 4. Praktyczne tworzenie aplikacji sieciowych", year: 2023, cover: "https://static01.helion.com.pl/global/okladki/vbig/djan44.jpg", ISBN: "9788383223704", publisher_id: publisher_list[1]},
            {title: "C++ w systemach wbudowanych. Skuteczna migracja z C do nowoczesnego C++", year: 2026, cover: "https://static01.helion.com.pl/global/okladki/vbig/cppwsy.jpg", ISBN: "9788328935600", publisher_id: publisher_list[1]},
            {title: "Aplikacje oparte na agentach AI. Projektowanie i wdrażanie systemów wieloagentowych", year: 2026, cover: "https://static01.helion.com.pl/global/okladki/vbig/apopag.jpg", ISBN: "9788328936829", publisher_id: publisher_list[1]},
            {title: "Blockchain. Przewodnik po technologii łańcucha bloków. Kryptowaluty, inteligentne kontrakty i aplikacje rozproszone", year: 2022, cover: "https://static01.helion.com.pl/global/okladki/vbig/bloprz.jpg", ISBN: "9788328393615", publisher_id: publisher_list[1]},
            {title: "Sztuka podstępu. Łamałem ludzi, nie hasła", year: 2010, cover: "https://static01.helion.com.pl/global/okladki/vbig/ar2vvv.jpg", ISBN: "9788328912809", publisher_id: publisher_list[1]},
            {title: "Cyberbezpieczeństwo i strategie blue teamów. Walka z cyberzagrożeniami w Twojej organizacji", year: 2024, cover: "https://static01.helion.com.pl/global/okladki/vbig/cystbl.jpg", ISBN: "9788328904569", publisher_id: publisher_list[1]},

            {title: "Zastosowanie systemów CAx w projektowaniu inżynierskim", year: 2022, cover: "https://oficyna.prz.edu.pl/fcp/zGBUKOQtTKlQhbx08SlkTUgxQX2o8DAoHNiwFE1xVS3pWFVZpCFghUHcKVigEQUw/18/public/nowosci-wydawnicze/2022/marciniec-zastosowanie-systemow-22-m.png", ISBN: "9788379345625", publisher_id: publisher_list[2]},
            {title: "Programowanie współbieżnych i rozproszonych aplikacji czasu rzeczywistego dla Linuxa", year: 2024, cover: "https://oficyna.prz.edu.pl/fcp/zGBUKOQtTKlQhbx08SlkTUgxQX2o8DAoHNiwFE1xVS3pWFVZpCFghUHcKVigEQUw/18/public/nowosci-wydawnicze/2024/samolej-programowanie-24-inter.png", ISBN: "9788379347261", publisher_id: publisher_list[2]},
            {title: "Wprowadzenie do informatyki I. Architektura komputerów, algorytmika, paradygmaty i języki programowania", year: 2024, cover: "https://oficyna.prz.edu.pl/fcp/YGBUKOQtTKlQhbx08SlkTUgxQX2o8DAoHNiwFE1xVTHlVFVZpCFghUHcKVigEQUw/18/public/otwarty-dostep/2024/od-samolej-cz1-okladka-2024-inter.png", ISBN: "9788371999445", publisher_id: publisher_list[2]},
            {title: "Wprowadzenie do informatyki II. Bezpieczeństwo systemów informatycznych, sieci komputerowe, systemy operacujne i bazy danych", year: 2024, cover: "https://oficyna.prz.edu.pl/fcp/2GBUKOQtTKlQhbx08SlkTUgxQX2o8DAoHNiwFE1xVTHlUFVZpCFghUHcKVigEQUw/18/public/otwarty-dostep/2024/od-samolej-cz2-okladka-2024-inter-1.png", ISBN: "9788371999844", publisher_id: publisher_list[2]},
            {title: "Podstawy telekomunikacji telekomunikacja analogowa i cyfrowa", year: 2017, cover: "https://oficyna.prz.edu.pl/fcp/zGBUKOQtTKlQhbx08SlkTUgxQX2o8DAoHNiwFE1xVS3pWFVZpCFghUHcKVigEQUw/18/public/nowosci-wydawnicze/2017/gotfryd-marek-okladka-17.png", ISBN: "9788379341757", publisher_id: publisher_list[2]},
        
        
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

    // New part
    await prisma.book.update({
        where: {id_book: book_list[11]},
        data: {authors: {connect: [{id_author: author_list[15]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[12]},
        data: {authors: {connect: [{id_author: author_list[16]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[13]},
        data: {authors: {connect: [{id_author: author_list[17]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[14]},
        data: {authors: {connect: [{id_author: author_list[18]},
                                   {id_author: author_list[19]},
                                ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[15]},
        data: {authors: {connect: [{id_author: author_list[20]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[16]},
        data: {authors: {connect: [{id_author: author_list[21]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[17]},
        data: {authors: {connect: [{id_author: author_list[22]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[18]},
        data: {authors: {connect: [{id_author: author_list[23]},
                                   {id_author: author_list[24]},    
                            ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[19]},
        data: {authors: {connect: [{id_author: author_list[25]},
                                   {id_author: author_list[26]},    
                            ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[20]},
        data: {authors: {connect: [{id_author: author_list[27]},
                                   {id_author: author_list[28]},    
                            ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[21]},
        data: {authors: {connect: [{id_author: author_list[29]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[22]},
        data: {authors: {connect: [{id_author: author_list[30]}]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[23]},
        data: {authors: {connect: [{id_author: author_list[30]},
                                   {id_author: author_list[31]},
                                   {id_author: author_list[32]},
                                   {id_author: author_list[33]},
                                   {id_author: author_list[34]},
                                ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[24]},
        data: {authors: {connect: [{id_author: author_list[30]},
                                   {id_author: author_list[31]},
                                   {id_author: author_list[32]},
                                   {id_author: author_list[33]},
                                ]}},
    });

    await prisma.book.update({
        where: {id_book: book_list[25]},
        data: {authors: {connect: [{id_author: author_list[34]}]}},
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

    // Add loan
    const loan = await prisma.loan.createMany({
        data: Array.from({ length: 1000}, (_, i) => {
            i = i+1;
            const random_start_loan = faker.date.between({from: '2026-01-01', to: '2026-03-31'});
            const random_return_loan = new Date(random_start_loan);
            random_return_loan.setDate(random_start_loan.getDate() + faker.number.int({min: 1, max: 30}));
            
            return {
                user_id: user_list[faker.number.int({min: 0, max: user_list.length-1})],
                copy_id: i,
                start_date: random_start_loan,
                return_date: random_return_loan,
            };
        }),
        skipDuplicates: true,
    })

    // Second loan
    const loan2 = await prisma.loan.createMany({
        data: Array.from({ length: 1000}, (_, i) => {
            i = i+1;
            const random_start_loan = faker.date.between({from: '2026-04-01', to: '2026-06-01'});
            const random_return_loan = faker.date.between({from: '2026-04-01', to: '2026-06-01'});
            const return_numbers = random_start_loan < random_return_loan ? random_return_loan : null;
            return {
                user_id: user_list[faker.number.int({min: 0, max: user_list.length-1})],
                copy_id: i,
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
