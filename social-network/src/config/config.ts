import { connect } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Make connection with the mongodb database by getting the host and DB name
 * from envirnment variables
 */
const connectToMongoDb = (): void => {
    connect(process.env.MONGO_URL)
        .then(() => console.log('Connected to MongoDb..'))
        .catch((error) => {
            console.log("Error in connecting to mongoDB " + error)
            throw error;
        });
}
export default connectToMongoDb;