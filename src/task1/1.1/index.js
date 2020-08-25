/**
 * Ask a question by stdin
 * @param {String} question - A question that you want ask
 */
const ask = question => process.stdout.write(question + ": ");


/**
 * Take the answer and revert to return
 * @param {String} str The prompted answer that will be reverted
 * @returns {String} The answer reverted
 */
const revertStr = str => {
    const strArray = str.toString().trim().split("");
    const strReverse = strArray.reverse();
    const strOutput = strReverse.join("");

    return strOutput;
};


/**
 * Initialize the listener to receive the answer
 */
process.stdin.on("data", data => {
    const output = revertStr(data);

    process.stdout.write("> " + output + "\n");
});


/**
 * Run the ask() function
 */
ask("Type what you want");