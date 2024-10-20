import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { NoteController } from './note.controller'
import { NoteModel } from './note.model'
import { NoteService } from './note.service'

@Module({
	controllers: [NoteController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: NoteModel,
				schemaOptions: {
					collection: 'Note',
				},
			},
		]),
	],
	providers: [NoteService],
})
export class NoteModule {}
