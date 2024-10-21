import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')

	app.enableCors({
		origin: 'https://scratchpad-frontend-umber.vercel.app/',
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Accept, Authorization',
	})

	await app.listen(4200)
}
bootstrap()
