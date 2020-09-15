const { readFile } = require('fs');
var fs = require('fs');
const decodeImage = require('jimp').read;
const qrcodeReader = require('qrcode-reader');
const path = require("path");
var join = require('path').join;
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

// 一、读取文件夹中所有二维码文件名
var getFiles = {
    getFilesName: (jsonPath) => {
        let jsonFiles = [];
        let findJsonFile = (path) => {
            let files = fs.readdirSync(path);
            files.forEach(function (item, index) {
                let fPath = join(path, item);
                let stat = fs.statSync(fPath);
                if (stat.isDirectory() === true) {
                    findJsonFile(fPath);
                }
                if (stat.isFile() === true) {
                    jsonFiles.push(fPath);
                }
            });
        }
        findJsonFile(jsonPath);
        logger.info(jsonFiles);
        // 二、遍历二维码文件
        var array = jsonFiles;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            var p = path.resolve(__dirname, `../${element}`);
            //读取文件
            readFile(p, function (err, fileBuffer) {
                if (err) {
                    throw new Error(err);
                    return;
                }
                decodeImage(fileBuffer, function (err, image) {
                    if (err) {
                        throw new Error(err);
                        return;
                    }
                    let decodeQR = new qrcodeReader();
                    decodeQR.callback = function (errorWhenDecodeQR, result) {
                        if (errorWhenDecodeQR) {
                            throw new Error(errorWhenDecodeQR)
                            return;
                        }
                        if (!result) {
                            logger.info('gone with wind');
                        } else {
                            logger.info("解析结果：",`${element.replace("image/","")} => ${result.result}`); //结果
                            // 三、写入txt文本中
                            fs.writeFile("output.txt",`${element.replace("image/","")},${result.result}\n`,{flag:"a"},function (err) {
                                if(err){
                                    return logger.error(err);
                                }
                                // logger.info("写入成功");
                            })
                        }
                    };
                    decodeQR.decode(image.bitmap);
                });
            })

        }
    }
}


getFiles.getFilesName("./image");// 获取文件夹中所有文件夹名、文件名




