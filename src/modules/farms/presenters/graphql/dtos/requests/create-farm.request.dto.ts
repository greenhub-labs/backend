import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateFarmRequestDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  postalCode?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  street?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
