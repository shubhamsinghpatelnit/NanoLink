class ApiError extends Error{
    statusCode: number;
    data: null;
    success: boolean;
    errors: any[];
    isOperational : boolean;


    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack = "",
    ){
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;
        this.isOperational = true;

        if(stack){
            this.stack = stack;
        } else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}