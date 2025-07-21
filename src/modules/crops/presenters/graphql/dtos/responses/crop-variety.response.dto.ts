import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CropVarietyResponseDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  scientificName?: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Number, { nullable: true })
  averageYield?: number;

  @Field(() => Number, { nullable: true })
  daysToMaturity?: number;

  @Field(() => Number, { nullable: true })
  plantingDepth?: number;

  @Field(() => Number, { nullable: true })
  spacingBetween?: number;

  @Field(() => String, { nullable: true })
  waterRequirements?: string;

  @Field(() => String, { nullable: true })
  sunRequirements?: string;

  @Field(() => Number, { nullable: true })
  minIdealTemperature?: number;

  @Field(() => Number, { nullable: true })
  maxIdealTemperature?: number;

  @Field(() => Number, { nullable: true })
  minIdealPh?: number;

  @Field(() => Number, { nullable: true })
  maxIdealPh?: number;

  @Field(() => [String])
  compatibleWith: string[];

  @Field(() => [String])
  incompatibleWith: string[];

  @Field(() => [String])
  plantingSeasons: string[];

  @Field(() => [String])
  harvestSeasons: string[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;

  @Field(() => String, { nullable: true })
  deletedAt?: string;
}
