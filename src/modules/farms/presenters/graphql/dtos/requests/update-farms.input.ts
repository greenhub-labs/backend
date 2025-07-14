import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateFarmsInput } from './create-farms.input';

@InputType()
export class UpdateFarmsInput  extends PartialType(CreateFarmsInput){
  @Field()
  id: string;
} 