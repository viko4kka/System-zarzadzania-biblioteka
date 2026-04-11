export interface UsersListParams {
    page?: number;
    limit?: number;
    search?: string;
}

//Response (only data)
export interface UserActionResponseDto {
    name: string;
    id: string;
}

export interface MakeAdminResponseDto extends UserActionResponseDto {
    is_Admin: boolean;
}

export interface BanUnbanResponseDto extends UserActionResponseDto {
    is_Banned: boolean;
}

export interface UserDto {
    id: string;
    name: string;
    lastname: string;
}

export interface UsersListResponseDto {
    users: UserDto[];
}

export interface BorrowedBookDto {
    id_loan: string;
    id_copy: string;
    title: string;
    author: string;
    copies: number;
}

export interface UserDataResponseDto {
    mail: string;
    name: string;
    lastname: string;
    joindate: Date;
    is_Admin: boolean;
    is_Banned: boolean;
    borrowed_Books: BorrowedBookDto[];
}

//Response (data + message + itp.)
export interface ApiMakeAdminResponseDto {
    message: string;
    data: MakeAdminResponseDto;
}

export interface ApiBanUnbanResponseDto {
    message: string;
    data: BanUnbanResponseDto;
}

//interface model
export interface User {
    id: string;
    name: string;
    lastname: string;
}

export interface BorrowedBook {
    loanId: string;
    copyId: string;
    title: string;
    author: string;
    copies: number;
}

export interface UserData {
    mail: string;
    name: string;
    lastname: string;
    joindate: Date;
    isAdmin: boolean;
    isBanned: boolean;
    borrowedBooks: BorrowedBook[];
}