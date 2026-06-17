import {
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CopyService } from './copy.service';
import { PrismaService } from '../prisma.service';


const mockPrisma = {
  copy: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  loan: {
    findUnique: jest.fn(),
    count: jest.fn(),
  },
  book: {
    findUnique: jest.fn(),
  }
};

describe('CopyService', () => {
  let service: CopyService;

  beforeEach(async () => {
    jest.clearAllMocks();
    

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CopyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CopyService>(CopyService);
  });
 
    
    // getCopyIsLoan
    describe('getCopyIsLoan', () => {
      it('Sprawdzenie dostępności dostępnej kopii', async () => {
        mockPrisma.loan.count.mockResolvedValue(4);
  
        const result = await service.getCopyIsLoan(1);

        expect(result).toBe(true);

      });

      it('Sprawdzenie dostępności niedostępnej kopii', async () => {
        mockPrisma.loan.count.mockResolvedValue(0);
  
        const result = await service.getCopyIsLoan(1);

        expect(result).toBe(false);
      });

      
    });

    // getCopy
    describe('getCopy', () => {
      it('Pobranie danych kopii', async () => {
        mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, 
                                                    book_id: 1,
                                                    is_actual: true,
                                                    is_loan: false,
                                                    });  
        mockPrisma.loan.count.mockResolvedValue(0);
  
        const result = await service.getCopy(1);
        if(result !== null){
            expect(result.id_copy).toBe(1);
            expect(result.book_id).toBe(1);
            expect(result.is_actual).toBe(true);
            expect(result.is_loan).toBe(false);
        }
      });

      it('Nie można pobrać danych nieistniejącej kopii', async () => {
        mockPrisma.copy.findUnique.mockResolvedValue(null);  
  
        const result = await service.getCopy(1);
        
        expect(result).toBe(null);
      });
      
    });
  
    // getCopy
    describe('getBookCopies', () => {
      const lista = [{id_copy: 8,
                    book_id: 1,
                    is_actual: true,
                    is_loan: true
                    },
                    {
                    id_copy: 13,
                    book_id: 1,
                    is_actual: true,
                    is_loan: true
                    },
                    {
                    id_copy: 25,
                    book_id: 1,
                    is_actual: true,
                    is_loan: true
                    },
                    {
                    id_copy: 35,
                    book_id: 1,
                    is_actual: true,
                    is_loan: true
                    },];

      it('Pobranie danych o kopiach książki', async () => {
        mockPrisma.copy.findMany.mockResolvedValue(lista);  
        mockPrisma.loan.count.mockResolvedValue(2);
        mockPrisma.copy.count.mockResolvedValue(4);
  
        const result = await service.getBookCopies(1, 1, 2);
        expect(result.data).toHaveLength(4);
        expect(result.data).toEqual(lista);

        expect(result.meta.page).toBe(1);
        expect(result.meta.limit).toBe(2);
        expect(result.meta.total).toBe(4);
        expect(result.meta.totalPages).toBe(2);

      });
      
      it('Pobranie pustej listy przez podanie złej strony', async () => {
        mockPrisma.copy.findMany.mockResolvedValue([]);  
        mockPrisma.loan.count.mockResolvedValue(0);
        mockPrisma.copy.count.mockResolvedValue(0);
  
        const result = await service.getBookCopies(1, 3, 2);
        expect(result.data).toHaveLength(0);
        expect(result.data).toEqual([]);

        expect(result.meta.page).toBe(3);
        expect(result.meta.limit).toBe(2);
        expect(result.meta.total).toBe(0);
        expect(result.meta.totalPages).toBe(0);

      });

      it('Pobranie danych o kopiach książki, pomimo podania ujemnej strony', async () => {
        mockPrisma.copy.findMany.mockResolvedValue(lista);  
        mockPrisma.loan.count.mockResolvedValue(2);
        mockPrisma.copy.count.mockResolvedValue(4);
  
        const result = await service.getBookCopies(1, -10, 2);
        expect(result.data).toHaveLength(4);
        expect(result.data).toEqual(lista);
        
        expect(result.meta.page).toBe(1);
        expect(result.meta.limit).toBe(2);
        expect(result.meta.total).toBe(4);
        expect(result.meta.totalPages).toBe(2);

      });

      it('Pobranie danych o kopiach książki, pomimo podania ujemnego limitu', async () => {
        mockPrisma.copy.findMany.mockResolvedValue(lista);  
        mockPrisma.loan.count.mockResolvedValue(2);
        mockPrisma.copy.count.mockResolvedValue(4);
  
        const result = await service.getBookCopies(1, 1, -10);
        expect(result.data).toHaveLength(4);
        expect(result.data).toEqual(lista);
        
        expect(result.meta.page).toBe(1);
        expect(result.meta.limit).toBe(1);
        expect(result.meta.total).toBe(4);
        expect(result.meta.totalPages).toBe(4);

      });

      it('Pobranie pustej listy o kopiach książki przez podanie błędnego id', async () => {
        mockPrisma.copy.findMany.mockResolvedValue([]);  
        mockPrisma.loan.count.mockResolvedValue(0);
        mockPrisma.copy.count.mockResolvedValue(0);
  
        const result = await service.getBookCopies(99, 1, 1);
        expect(result.data).toHaveLength(0);
        expect(result.data).toEqual([]);
        
        expect(result.meta.page).toBe(1);
        expect(result.meta.limit).toBe(1);
        expect(result.meta.total).toBe(0);
        expect(result.meta.totalPages).toBe(0);

      });

    });


    // addCopy
    describe('addCopy', () => {
      it('Utworzenie nowej kopii', async () => {
        mockPrisma.copy.create.mockResolvedValue({ id_copy: 1, 
                                                    book_id:1,
                                                    is_actual: true,
                                                    is_loan: false,
                                                    });
        mockPrisma.loan.count.mockResolvedValue(0);
        mockPrisma.book.findUnique.mockResolvedValue({id_book:1})
  
  
        const result = await service.addCopy(1);
      
        expect(result.id_copy).toBe(1);
        expect(result.book_id).toBe(1);
        expect(result.is_actual).toBe(true);
        expect(result.is_loan).toBe(false);
      });
      
      it('Nie można stworzyć kopii nieistniejącej książki', async () => {
        mockPrisma.book.findUnique.mockResolvedValue(null);  
        await expect(service.addCopy(1)).rejects.toThrow(NotFoundException);
      
      });

    });

    // remove_copy
    describe('removeCopy', () => {
      it('Kopia książki została usunięta', async () => {
        mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, 
                                                    book_id:1,
                                                    is_actual: true,
                                                    });
  
        mockPrisma.copy.update.mockResolvedValue({ id_copy: 1, 
                                              is_actual: false});
        mockPrisma.loan.count.mockResolvedValue(0);
  
        const result = await service.removeCopy(1);
      
        expect(result.id_copy).toBe(1);
        expect(result.is_actual).toBe(false);
      });
      
      it('Kopia nie może być usunięta, ponieważ jest aktualnie wypożyczona', async () => {
        mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, 
                                                    book_id:1,
                                                    is_actual: true,
                                                   });
        mockPrisma.loan.count.mockResolvedValue(3);
  
        await expect(service.removeCopy(1)).rejects.toThrow(BadRequestException);
      });
  
      it('Kopia nie może być usunięta, ponieważ została usunięta już wcześniej', async () => {
        mockPrisma.copy.findUnique.mockResolvedValue({ id_copy: 1, 
                                                    book_id:1,
                                                    is_actual: false,
                                                   });
        mockPrisma.loan.count.mockResolvedValue(0);
  
        await expect(service.removeCopy(1)).rejects.toThrow(BadRequestException);
      });

      it('Nie odnaleziono kopii', async () => {
        mockPrisma.copy.findUnique.mockResolvedValue(null);
  
        await expect(service.removeCopy(1)).rejects.toThrow(BadRequestException);
      });
    });


});   
