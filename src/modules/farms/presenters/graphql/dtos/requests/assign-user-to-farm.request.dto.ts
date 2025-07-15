import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';

/**
 * Input DTO for assigning a user to a farm
 */
@InputType()
export class AssignUserToFarmRequestDto {
  @Field()
  @IsUUID()
  farmId: string;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsEnum(FARM_MEMBERSHIP_ROLES)
  role: FARM_MEMBERSHIP_ROLES;
}
