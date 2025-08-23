const {getReasonPhrase, StatusCodes} = require("http-status-codes");
function requestFormatter(req, res, next) {
    const orginalJson = res.json;
    const status = res.statusCode;

    res.json = (data)=>{
        const response = {
            status: res.statusCode >=200 && res.statusCode < 300 ? "success" : "error",
            statusCode: res.statusCode,
            message: getReasonPhrase(res.statusCode),
            // data: res.statusCode >=200 && res.statusCode < 300 ? data : null,
            // error: res.statusCode >=200 && res.statusCode < 300 ? null : data
        };

        if(res.statusCode >=200 && res.statusCode < 300) {
            response.data = data.pagination ? data.data : data;
        }
        if(res.statusCode>300) {
            response.error = data
        }

        if(data.pagination) {
            response.pagination = data.pagination
        }
        orginalJson.call(res, response);

        
    };

    next();

}

module.exports ={
    requestFormatter};