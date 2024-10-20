import { IsString } from 'class-validator'

export class RefreshTokenDto {
	@IsString({
		message: 'Refresh token does not exist',
	})
	refreshToken: string
}
