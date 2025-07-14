import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FarmsResponse {
  @Field()
  id: string;

  @Field({ nullable: true })
  // Add more fields as needed
  name?: string;
} 