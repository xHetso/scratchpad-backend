import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface NoteModel extends Base {}

export class NoteModel extends TimeStamps {
	@prop()
	title: string

	@prop()
	content: string

	@prop()
	userId: string
}
