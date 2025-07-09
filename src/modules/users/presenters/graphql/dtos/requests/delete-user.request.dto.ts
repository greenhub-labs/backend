import { Field, InputType } from '@nestjs/graphql';

/**
 * Input DTO for deleteUser GraphQL mutation
 */
@InputType()
export class DeleteUserRequestDto {
  /**
   * Unique identifier of the user to delete
   */
  @Field()
  id: string;
}
