const readXlsxFile = require('read-excel-file/node');
const writeXlsxFile = require('write-excel-file/node');
const path = require('path');
const FILE_ROOTH_PATH = `${path.dirname(__dirname)}/data`;

const readExcel = async (fileName = "TestData") => {
    try {
        return await readXlsxFile(`${FILE_ROOTH_PATH}/${fileName}.xlsx`);
    } catch (error) {
        console.log(error);
    }
}

const writeExcel = async (schema, data, fileName = "TestData") => {
    try {
        await writeXlsxFile(data, {
            schema,
            filePath: `${FILE_ROOTH_PATH}/${fileName}.xlsx`
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { readExcel, writeExcel }