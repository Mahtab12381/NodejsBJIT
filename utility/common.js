const success = (msg,data=null)=>{
    return {
        status: true,
        message: msg,
        data: data
    }
};

const failure = (msg,error=null)=>{
    return {
        status: false,
        message: msg,
        error: error
    }
};


module.exports={success,failure}