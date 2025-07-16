import { ObjectType, Field } from '@nestjs/graphql';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';

@ObjectType()
export class UserFarmMembershipDto {
  @Field()
  farmId: string;
  @Field()
  farmName: string;
  @Field(() => String)
  role: FARM_MEMBERSHIP_ROLES;
}

@ObjectType()
export class UserDetailsResponseDto {
  @Field()
  id: string;
  @Field({ nullable: true })
  firstName?: string;
  @Field({ nullable: true })
  lastName?: string;
  @Field({ nullable: true })
  avatar?: string;
  @Field({ nullable: true })
  bio?: string;
  @Field()
  isActive: boolean;
  @Field()
  isDeleted: boolean;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
  @Field({ nullable: true })
  deletedAt?: Date;
  @Field(() => [UserFarmMembershipDto], { nullable: true })
  farms?: UserFarmMembershipDto[];
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  phone?: string;
}
