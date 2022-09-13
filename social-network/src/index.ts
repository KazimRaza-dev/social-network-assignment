import express, { Express } from "express";
import { connectToMongoDb } from "./config/index.config";
import cors, { CorsOptions } from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import routes from "./routes/index.route";
import { handleError } from "./middlewares/index.middleware";
import { checkEnvVariables } from "./utils/index.util";

config();
const app: Express = express();
connectToMongoDb();
checkEnvVariables();

const PORT: number = parseInt(process.env.PORT as string, 10);
const corsOptions: CorsOptions = {
    origin: `http://localhost:${PORT}`,
    methods: "HEAD, PUT, PATCH, POST, DELETE",
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(routes);
app.use(handleError);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost/${PORT}`);
})