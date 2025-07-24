import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateCropVarietyRequestDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  scientificName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  averageYield?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  daysToMaturity?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  plantingDepth?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  spacingBetween?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  waterRequirements?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sunRequirements?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  minIdealTemperature?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxIdealTemperature?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  minIdealPh?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxIdealPh?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  compatibleWith?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  incompatibleWith?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  plantingSeasons?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  harvestSeasons?: string[];
}
