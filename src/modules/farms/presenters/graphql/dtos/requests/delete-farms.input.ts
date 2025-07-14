import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteFarmsInput  {
  @Field()
  id: string;
} 