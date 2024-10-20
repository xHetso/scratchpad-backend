import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')

	// Обновленная настройка CORS
	app.enableCors({
		origin: 'http://localhost:5173', // или использовать true для разрешения всех источников
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Accept, Authorization', // Добавить Authorization
	})

	await app.listen(4200)
}
bootstrap()
