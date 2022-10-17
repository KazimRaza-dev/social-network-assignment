import { config } from "dotenv";
config();

/**
 * Check whether the port and jwtPrivateKey environment variables are set or not
 * if not set then exit the applcation after showing proper error message
 */
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
