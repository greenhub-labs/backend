import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponseDto } from 'src/modules/users/presenters/graphql/dtos/responses/user.response.dto';
import { FARM_MEMBERSHIP_ROLES } from 'src/modules/farms/domain/constants/farm-membership-roles.constant';

@ObjectType()
export class FarmMemberResponseDto extends UserResponseDto {
  @Field(() => String, { description: 'Role of the user in this farm' })
  role: FARM_MEMBERSHIP_ROLES;
}

@ObjectType()
export class FarmResponseDto {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  country?: string;
  @Field({ nullable: true })
  state?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  postalCode?: string;
  @Field({ nullable: true })
  street?: string;
  @Field({ nullable: true })
  latitude?: number;
  @Field({ nullable: true })
  longitude?: number;
  @Field()
  isActive: boolean;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
  @Field({ nullable: true })
  deletedAt?: Date;
  @Field(() => [FarmMemberResponseDto], {
    nullable: true,
    description: 'Members (users) assigned to this farm',
  })
  members?: FarmMemberResponseDto[];
}
