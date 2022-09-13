import express, { Request, Response } from "express";
import { connectToMongoDb } from "./config/index.config";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
connectToMongoDb();

const PORT: number = parseInt(process.env.PORT as string, 10);
if (!process.env.PORT) {
    console.log("Port number not defined. Exiting program..");
    process.exit(1);
}
if (!process.env.jwtPrivateKey) {
    console.log("FATAL ERROR! jwt private key not defined.");
    process.exit(1);
}

app.use(bodyParser.json);
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use("/", (req: Request, res: Response) => {
    res.send("Hello worlds..")
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost/${PORT}`);
})