import { IsInt, IsPositive } from 'class-validator';

export class LoanActionDto {
  @IsInt({ message: 'copy_id musi być liczbą całkowitą' })
  @IsPositive({ message: 'copy_id musi być większe od zera' })
  copy_id!: number;
}
