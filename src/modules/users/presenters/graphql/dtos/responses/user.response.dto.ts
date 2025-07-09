import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Response DTO for User GraphQL type
 */
@ObjectType()
export class UserResponseDto {
  /**
   * Unique identifier of the user
   */
  @Field()
  id: string;

  /**
   * Name of the user
   */
  @Field()
  name: string;

  /**
   * Avatar URL of the user
   */
  @Field({ nullable: true })
  avatarUrl?: string;

  /**
   * Deletion timestamp (if soft deleted)
   */
  @Field({ nullable: true })
  deletedAt?: Date;
}
