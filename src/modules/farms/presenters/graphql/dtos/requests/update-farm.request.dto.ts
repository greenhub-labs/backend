import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateFarmRequestDto {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

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

  @Field({ nullable: true })
  isActive?: boolean;
}
