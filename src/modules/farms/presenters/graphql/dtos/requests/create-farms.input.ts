import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFarmsInput {
  @Field()
  // Add more fields as needed
  name: string;
} 