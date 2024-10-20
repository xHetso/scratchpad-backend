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

	async getAll(searchTerm?: string) {
		let options = {}
		if (searchTerm)
			options = {
				$or: [
					{ title: new RegExp(searchTerm, 'i') },
					{ content: new RegExp(searchTerm, 'i') },
				],
			}
		return this.NoteModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async byId(id: string) {
		const note = await this.NoteModel.findById(id)
		if (!note) {
			throw new NotFoundException('Note not found')
		}
		return note
	}

	async create(dto: CreateNoteDto, userId: string) {
		const note = await this.NoteModel.create({ ...dto, userId })
		return note._id
	}

	async update(id: string, dto: CreateNoteDto) {
		const updatedNote = await this.NoteModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec()
		if (!updatedNote) {
			throw new NotFoundException('Note not found')
		}
		return updatedNote
	}

	async delete(id: string) {
		const deletedNote = await this.NoteModel.findByIdAndDelete(id).exec()
		if (!deletedNote) {
			throw new NotFoundException('Note not found')
		}
		return deletedNote
	}
}
