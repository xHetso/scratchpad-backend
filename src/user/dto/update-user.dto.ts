import { IsEmail } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string
	name?: string
	surname?: string
	password?: string
	isAdmin?: boolean
	avatar?: string
	country?: string
	city?: string
	instagram?: string
	telegram?: string
	youtube?: string
	information?: string
}
