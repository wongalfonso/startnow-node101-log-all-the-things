const express = require('express');
const fs = require('fs');
var dateFormat = require("dateformat");
const app = express();
// const { COPYFILE_EXCL} = fs.constants;


var now = new Date();
var cDate = dateFormat(now, "yyyy_mm_dd_HH_MM_ss");
var template = "Agent,Time,Method,Resource,Version,Status";

function logger(req, res, next) {
    if (req.method === "GET") {

        var newCSV;
        var head = req.headers["user-agent"]
        head = head.replace(/,/g, "");
        var version = "HTTP/" + req.httpVersion;
        var date = new Date().toISOString();
        var comma = ",";
        var meth = req.method;
        var stat = res.statusCode;
        var path = req.path;
        newCSV = head + comma;
        newCSV += date + comma;
        newCSV += meth + comma;
        newCSV += path + comma;
        newCSV += version + comma;
        newCSV += stat;

        console.log(newCSV);

        var inLog = fs.readFileSync("./server/log.csv", "utf8");

            inLog = inLog.split("\n");
            if (inLog.length < 21) {
                fs.appendFile("./server/log.csv", "\n" + newCSV, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    

                });
            } else {
                fs.copyFileSync("./server/log.csv", "./server/log" + cDate + ".csv");
                fs.writeFileSync("./server/log.csv", template);
            };
    }
    next();
}


app.use(logger);
// write your logging code here

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    // console.log(csvToJson());
    res.status(200).send("ok");

});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here

    res.json(csvToJson());
});

function csvToJson() {
    var data = fs.readFileSync("./server/log.csv", "utf8")
    var log = data.split("\n");
    var result = [];
    var header = log[0].split(",");
    for (var j = 1; j < log.length; j++) {

        var obj = {};
        var currentLog = log[j].split(",");
        
        for (var k = 0; k < header.length; k++) {
            obj[header[k]] = currentLog[k];
            
        }

        result.push(obj);
    }
    // console.log(result);
    return result;
}




module.exports = app;
