import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, './.env') });

const { APP_PORT } = process.env;

export default { APP_PORT };
