import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from 'src/user/user.model'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async login(dto: AuthLoginDto) {
		const user = await this.validatorUser(dto)
		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Please sign in!')
		}

		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) {
			throw new UnauthorizedException('Invalid refresh or expired!')
		}

		const user = await this.UserModel.findById(result._id)

		if (!user) throw new UnauthorizedException('User not found')

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async register(dto: AuthRegisterDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })
		if (oldUser) {
			throw new BadRequestException(
				'User with this email is already registered',
			)
		}

		const salt = await genSalt(10)

		const newUser = new this.UserModel({
			email: dto.email,
			name: dto.name,
			surname: dto.surname,
			password: await hash(dto.password, salt),
		})

		const user = await newUser.save()

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async validatorUser(dto: AuthLoginDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })
		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		const IsValidPassword = await compare(dto.password, user.password)
		if (!IsValidPassword) {
			throw new BadRequestException('Invalid password')
		}
		return user
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '500d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '300d',
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
			name: user.name,
			surname: user.surname,
			roles: user.roles,
		}
	}
}
