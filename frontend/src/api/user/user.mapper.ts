import type {
    ApiBanUnbanResponseDto, 
    ApiMakeAdminResponseDto, 
    BorrowedBook, 
    BorrowedBookDto, 
    User, 
    UserData, 
    UserDataResponseDto,
    UserDto,
    UsersListResponseDto
} from "./user.types";

export const mapMakeAdminResponse = (dto: ApiMakeAdminResponseDto): { 
    data: { name: string, id: string, isAdmin: boolean }, 
    message: string 
} => ({
    data: { 
        name: dto.data.name, 
        id: dto.data.id, 
        isAdmin: dto.data.is_Admin
    }, 
    message: dto.message
});

export const mapBanUnbanResponse = (dto: ApiBanUnbanResponseDto): { 
    data: { name: string, id: string, isBanned: boolean }, 
    message: string 
} => ({
    data: { 
        name: dto.data.name, 
        id: dto.data.id, 
        isBanned: dto.data.is_Banned
    }, 
    message: dto.message
});

const mapUser = (dto: UserDto): User => ({
    id: dto.id,
    name: dto.name,
    lastname: dto.lastname
});

export const mapUsersListResponse = (dto: UsersListResponseDto): { users: User[] } => ({
    users: dto.users.map(mapUser),
});

const mapBorrowedBook = (dto: BorrowedBookDto): BorrowedBook => ({
    loanId: dto.id_loan,
    copyId: dto.id_copy,
    title: dto.title,
    author: dto.author,
    copies: dto.copies
});

export const mapUserDataResponse = (dto: UserDataResponseDto): UserData => ({
    mail: dto.mail,
    name: dto.name,
    lastname: dto.lastname,
    joindate: dto.joindate,
    isAdmin: dto.is_Admin,
    isBanned: dto.is_Banned,
    borrowedBooks:(dto.borrowed_Books ?? []).map(mapBorrowedBook)
});