import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CreateNoteDto } from './dto/create-note.dto'
import { NoteModel } from './note.model'

@Injectable()
export class NoteService {
	constructor(
		@InjectModel(NoteModel)
		private readonly NoteModel: ModelType<NoteModel>,
	) {}

	async getAll(userId: string, searchTerm?: string) {
		let options: any = { userId }

		if (searchTerm) {
			options = {
				...options,
				$or: [
					{ title: new RegExp(searchTerm, 'i') },
					{ content: new RegExp(searchTerm, 'i') },
				],
			}
		}

		return this.NoteModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async byId(id: string, userId: string) {
		const note = await this.NoteModel.findOne({ _id: id, userId })
		if (!note) {
			throw new NotFoundException('Note not found')
		}
		return note
	}

	async create(dto: CreateNoteDto, userId: string) {
		const note = await this.NoteModel.create({ ...dto, userId })
		return note._id
	}

	async update(id: string, dto: CreateNoteDto, userId: string) {
		const updatedNote = await this.NoteModel.findOneAndUpdate(
			{ _id: id, userId },
			dto,
			{ new: true },
		).exec()
		if (!updatedNote) {
			throw new NotFoundException('Note not found')
		}
		return updatedNote
	}

	async delete(id: string, userId: string) {
		const deletedNote = await this.NoteModel.findOneAndDelete({
			_id: id,
			userId,
		}).exec()
		if (!deletedNote) {
			throw new NotFoundException('Note not found')
		}
		return deletedNote
	}
}
