import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  nombre?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
