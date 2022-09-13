import express, { Request, Response } from "express";
import { connectToMongoDb } from "./config/index.config";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
connectToMongoDb();

app.use("/", (req: Request, res: Response) => {
    console.log("hello from console");

    res.send("Hello worlds..")
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost/${PORT}`);
})