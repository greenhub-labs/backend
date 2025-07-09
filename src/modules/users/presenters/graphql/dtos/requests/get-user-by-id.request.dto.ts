import { Field, InputType } from '@nestjs/graphql';

/**
 * Input DTO for getUserById GraphQL query
 */
@InputType()
export class GetUserByIdRequestDto {
  /**
   * Unique identifier of the user
   */
  @Field()
  id: string;
}
