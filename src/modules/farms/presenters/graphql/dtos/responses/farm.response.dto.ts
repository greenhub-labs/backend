import { Field, ObjectType } from '@nestjs/graphql';
import { PlotResponseDto } from 'src/modules/plots/presenters/graphql/dtos/responses/plot.response.dto';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';

@ObjectType()
export class FarmMemberResponseDto {
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
  @Field({ nullable: true })
  phone?: string;
  @Field({ nullable: true })
  email?: string;
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
  @Field(() => [PlotResponseDto], {
    nullable: true,
    description: 'Plots assigned to this farm',
  })
  plots?: PlotResponseDto[];
}
