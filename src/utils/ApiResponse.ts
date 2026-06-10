class ApiResponse<T>{
    message : string;
    data : T;
    success : boolean;
    statusCode : number;

    constructor(
        statusCode : number,
        data : T,
        message = "Success",
    ){
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400
    }
}


export {ApiResponse}