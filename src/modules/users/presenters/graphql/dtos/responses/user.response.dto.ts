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
   * First name of the user
   */
  @Field({ nullable: true })
  firstName?: string;

  /**
   * Last name of the user
   */
  @Field({ nullable: true })
  lastName?: string;

  /**
   * Avatar URL of the user
   */
  @Field({ nullable: true })
  avatar?: string;

  /**
   * Bio or description of the user
   */
  @Field({ nullable: true })
  bio?: string;

  /**
   * Whether the user is active
   */
  @Field()
  isActive: boolean;

  /**
   * Whether the user is deleted (soft delete)
   */
  @Field()
  isDeleted: boolean;

  /**
   * Creation timestamp
   */
  @Field()
  createdAt: Date;

  /**
   * Last update timestamp
   */
  @Field()
  updatedAt: Date;

  /**
   * Deletion timestamp (if soft deleted)
   */
  @Field({ nullable: true })
  deletedAt?: Date;
}
