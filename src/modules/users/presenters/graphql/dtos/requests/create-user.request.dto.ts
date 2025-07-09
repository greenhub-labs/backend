import { Field, InputType } from '@nestjs/graphql';

/**
 * Input DTO for createUser GraphQL mutation
 */
@InputType()
export class CreateUserRequestDto {
  /**
   * First name of the user
   */
  @Field()
  firstName: string;

  /**
   * Last name of the user (optional)
   */
  @Field({ nullable: true })
  lastName?: string;

  /**
   * Avatar URL of the user (optional)
   */
  @Field({ nullable: true })
  avatar?: string;

  /**
   * Bio or description of the user (optional)
   */
  @Field({ nullable: true })
  bio?: string;
}
