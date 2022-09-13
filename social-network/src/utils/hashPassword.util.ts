import { genSalt, hash, compare } from "bcrypt";

const passwordHashing = {
    hashPassword: async (password: string): Promise<string> => {
        try {
            const salt: string = await genSalt(10)
            const hashedPassword: string = await hash(password, salt);
            return hashedPassword;
        } catch (error) {
            throw error;
        }
    },

    unhashPassword: async (userPassword: string, dbHashPassword): Promise<boolean> => {
        const isPasswordCorrect: boolean = await compare(userPassword, dbHashPassword);
        return isPasswordCorrect;
    }
}

export default passwordHashing;