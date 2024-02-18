class ApiErrors extends Error {
    status: number;
    errors: any[];

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(): ApiErrors {
        return new ApiErrors(401, "Пользователь не авторизован");
    }

    static BadRequest(message: string, errors: any[] = []): ApiErrors {
        return new ApiErrors(400, message, errors);
    }
    static NotActivation(): ApiErrors{
        return new ApiErrors(403, 'Пользователь не имеет прав доступа к контенту,');
    }
}

export default ApiErrors;