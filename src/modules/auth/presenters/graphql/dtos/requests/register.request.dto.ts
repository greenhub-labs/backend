import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

/**
 * RegisterInput DTO
 * Input type for user registration GraphQL mutation
 *
 * @author GreenHub Labs
 */
@InputType()
export class RegisterInput {
  /**
   * User email address
   */
  @Field(() => String, { description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  /**
   * User password (plain text, will be hashed)
   */
  @Field(() => String, { description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  /**
   * User first name (optional)
   */
  @Field(() => String, { nullable: true, description: 'User first name' })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(100, { message: 'First name cannot exceed 100 characters' })
  firstName?: string;

  /**
   * User last name (optional)
   */
  @Field(() => String, { nullable: true, description: 'User last name' })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(100, { message: 'Last name cannot exceed 100 characters' })
  lastName?: string;

  /**
   * User phone number (optional)
   */
  @Field(() => String, { nullable: true, description: 'User phone number' })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number',
  })
  phone?: string;
}
