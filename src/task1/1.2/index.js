const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");


/**
 * Setting program variables
 */
const srcFile = path.resolve(__dirname, "./../assets/nodejs-hw1-ex1.csv");
const newFile = path.resolve(__dirname, "./../assets/task1.2.txt");
const csvOptions = { delimiter: ";" };


/**
 * Clear file content before save new content
 * @param {String} file The file which will be cleared
 */
const clearFile = file => {
    return fs.writeFileSync(file, "", function(error) {
        if(error) {
            return console.log(error);
        }
    });
};


/**
 * Write a new file content
 * @param {String} file The file that will be filled
 * @param {Array} content An array of lines to be write into a new file
 */
const writeJson = (file, content) => {
    //First call clearFile() function to clear the file
    clearFile(file);

    //Iterate through the file's line
    content.map(line => {
        fs.appendFileSync(file, JSON.stringify(line) + "\n", error => {
            if(error) {
                return console.log(error);    
            }            
        });
    });

    // print output and finish the process
    process.stdout.write("The file has been saved!\n");
    process.exit();
}


/**
 * Call csv() package and start the read/write
 */
csv(csvOptions)
    .fromFile(srcFile)
    .then(data => { 
        writeJson(newFile, data);
    });