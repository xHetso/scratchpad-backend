import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CreateNoteDto } from './dto/create-note.dto'
import { NoteService } from './note.service'
import { User } from 'src/user/decorators/user.decorator'

@Controller('notes')
export class NoteController {
	constructor(private readonly noteService: NoteService) {}

	@Get()
	@Auth()
	async getAll(
		@User('_id') userId: string,
		@Query('searchTerm') searchTerm?: string,
	) {
		return this.noteService.getAll(userId, searchTerm)
	}

	@Get(':id')
	@Auth()
	async get(
		@User('_id') userId: string,
		@Param('id', IdValidationPipe) id: string,
	) {
		return this.noteService.byId(id, userId)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth()
	async create(@User('_id') userId: string, @Body() dto: CreateNoteDto) {
		return this.noteService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth()
	async update(
		@User('_id') userId: string,
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateNoteDto,
	) {
		return this.noteService.update(id, dto, userId)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async delete(
		@User('_id') userId: string,
		@Param('id', IdValidationPipe) id: string,
	) {
		return this.noteService.delete(id, userId)
	}
}
