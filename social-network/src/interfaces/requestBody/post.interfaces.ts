interface iPostBody {
    title: string,
    description: string,
    userId?: string
}

interface iEditPostBody {
    title?: string,
    description?: string,
}

export { iPostBody, iEditPostBody };
