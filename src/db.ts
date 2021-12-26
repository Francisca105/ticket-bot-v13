import mongoose from 'mongoose'
import {mongo} from './config.json'

class DatabaseClient {
	static init() {
		mongoose
			.connect(mongo.url)
			.then(() => {
				console.log("Conectado na db");
			})
			.catch(console.error);
	}
}

export default DatabaseClient;