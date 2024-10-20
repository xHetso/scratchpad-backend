import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
	) {}

	async byId(_id: string) {
		const user = await this.UserModel.findById(_id)
		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)
		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Email busy')
		}

		user.email = dto.email

		if (dto.name) user.name = dto.name
		if (dto.surname) user.surname = dto.surname
		if (dto.avatar) user.avatar = dto.avatar
		if (dto.country) user.country = dto.country
		if (dto.city) user.city = dto.city
		if (dto.instagram) user.instagram = dto.instagram
		if (dto.telegram) user.telegram = dto.telegram
		if (dto.youtube) user.youtube = dto.youtube
		if (dto.information) user.information = dto.information

		if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

		await user.save()
		return
	}

	async getCount() {
		return this.UserModel.find().count().exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}
		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}

	async delete(id: string) {
		return this.UserModel.findByIdAndDelete(id).exec()
	}
}
