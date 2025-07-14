import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteFarmRequestDto {
  @Field()
  id: string;
}
