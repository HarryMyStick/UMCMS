import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  contribution_id: string;

  @IsNotEmpty()
  status: string;
}