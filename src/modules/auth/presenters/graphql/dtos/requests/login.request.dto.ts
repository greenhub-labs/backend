import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * LoginInput DTO
 * Input type for user login GraphQL mutation
 *
 * @author GreenHub Labs
 */
@InputType()
export class LoginInput {
  /**
   * User email address
   */
  @Field(() => String, { description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  /**
   * User password (plain text)
   */
  @Field(() => String, { description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password cannot be empty' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;
}
