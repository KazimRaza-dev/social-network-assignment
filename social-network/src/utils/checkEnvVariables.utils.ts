import { config } from "dotenv";
config();

const checkEnvVariables = (): void => {
  if (!process.env.PORT) {
    console.log("Port number not defined. Exiting program..");
    process.exit(1);
  }
  if (!process.env.jwtPrivateKey) {
    console.log("FATAL ERROR! jwt private key not defined.");
    process.exit(1);
  }
};

export default checkEnvVariables;
