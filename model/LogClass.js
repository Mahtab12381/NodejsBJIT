const fs = require("fs");
const path = require("path");

class LogClass {
    async writeLog(logcontent) {
        return fs.promises.readFile(path.join(__dirname, "..", "server", "log.json"), { encoding: "utf-8" })
            .then((data) => {
                const loglist = JSON.parse(data);
                loglist.push(logcontent);
                return fs.promises.writeFile(path.join(__dirname,  "..","server", "log.json"), JSON.stringify(loglist))
                .then(()=>{
                    console.log("Log Updated");
                })
                .catch(()=>{
                    console.log("Log failed to update"); 
                })
            })       
            .catch((error) => {
                console.log(error);
            })
    }

    async readLog(id){
        return fs.promises.readFile(path.join(__dirname, "..", "server", "log.json"), { encoding: "utf-8" })
            .then((data) => {
                const parsedData = JSON.parse(data);
                const deletedItems = parsedData.filter(item => item.hasOwnProperty("deletedItem"));
                const filtered = deletedItems.find(item => item.deletedItem.id === id)
                if(filtered!==undefined){
                return{

                    flag:true,
                    data:filtered

                }}
                else{
                    return{

                        flag:false
                    }
                }

            })
            .catch(()=>{

                return {
                    flag:false
                }

            })

    }
}
module.exports = new LogClass();