import { Field, InputType } from '@nestjs/graphql';

/**
 * Input DTO for restoreUser GraphQL mutation
 */
@InputType()
export class RestoreUserRequestDto {
  /**
   * Unique identifier of the user to restore
   */
  @Field()
  id: string;
}
