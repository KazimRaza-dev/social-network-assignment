import { connectToMongoDb } from "./config/index.config";
import { app, server } from "./sockets/index.sockets";
import cors, { CorsOptions } from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import routes from "./routes/index.route";
import { handleError } from "./middlewares/index.middleware";
import { checkEnvVariables } from "./utils/index.util";

config();
connectToMongoDb();
checkEnvVariables();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const corsOptions: CorsOptions = {
    origin: `${process.env.STRIPE_SERVER_URL}`,
    methods: "HEAD, PUT, PATCH, POST, DELETE",
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(routes);
app.use(handleError);

server.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});