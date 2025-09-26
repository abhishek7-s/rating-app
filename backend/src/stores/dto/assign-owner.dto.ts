import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignOwnerDto {
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;
}