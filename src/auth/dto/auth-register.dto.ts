import { IsString, MinLength } from 'class-validator'

export class AuthRegisterDto {
	@IsString()
	email: string
	@IsString()
	name: string
	@IsString()
	surname: string
	@MinLength(6, {
		message: 'Password cannot be less than 6 characters',
	})
	@IsString()
	password: string
}
