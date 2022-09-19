
interface iRegisterBody {
    email: string,
    password: string,
    fname: string,
    lname: string,
    phoneNo: string,
    role: string
    following?: string[],
}

interface iLoginBody {
    email: string,
    password: string,
    role: string
}

export { iRegisterBody, iLoginBody };
