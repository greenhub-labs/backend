import { Field, InputType } from '@nestjs/graphql';

/**
 * Input DTO for updateUser GraphQL mutation
 */
@InputType()
export class UpdateUserRequestDto {
  /**
   * Unique identifier of the user
   */
  @Field()
  id: string;

  /**
   * New first name of the user (optional)
   */
  @Field({ nullable: true })
  firstName?: string;

  /**
   * New last name of the user (optional)
   */
  @Field({ nullable: true })
  lastName?: string;

  /**
   * New avatar URL of the user (optional)
   */
  @Field({ nullable: true })
  avatar?: string;

  /**
   * New bio or description of the user (optional)
   */
  @Field({ nullable: true })
  bio?: string;
}
