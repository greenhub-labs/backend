import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetFarmByIdRequestDto {
  @Field()
  id: string;
}
