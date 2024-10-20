import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop()
	name: string

	@prop()
	surname: string

	@prop({ unique: true })
	email: string

	@prop()
	password: string

	@prop({ default: false })
	isAdmin: boolean

	@prop({ default: 'Developer' })
	roles: string

	@prop()
	avatar: string

	@prop()
	country: string

	@prop()
	city: string

	@prop()
	instagram: string

	@prop()
	telegram: string

	@prop()
	youtube: string

	@prop()
	information: string
}
