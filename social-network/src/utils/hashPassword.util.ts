import { genSalt, hash, compare } from "bcrypt";

const passwordHashing = {
    /**
     * Generate hash of user password at time of registration   
     *
     * @param password User password to be hashed
     * @returns Hashed password
     */
    hashPassword: async (password: string): Promise<string> => {
        try {
            const salt: string = await genSalt(10)
            const hashedPassword: string = await hash(password, salt);
            return hashedPassword;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Compare user enter password with already existing hashed password   
     *
     * @param userPassword Password entered by user
     * @param dbHashPassword Password existing in database
     * @returns Boolean value showing whether both passwords match or not
     */
    comparePassword: async (userPassword: string, dbHashPassword): Promise<boolean> => {
        const isPasswordCorrect: boolean = await compare(userPassword, dbHashPassword);
        return isPasswordCorrect;
    }
}

export default passwordHashing;