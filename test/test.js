var QRCode = require('qrcode')
const { readFile, readFileSync } = require('fs');
const decodeImage = require('jimp').read;
const qrcodeReader = require('qrcode-reader');
const path = require("path");

describe("二维码", () => {
    it("生成二维码", () => {
        QRCode.toString('I am a pony!', { type: 'terminal' }, function (err, url) {
            console.log(url)
        })
    })

    it("生成个性化风格二维码", () => {
        QRCode.toFile('image/definitionsQR.jpg', 'Some text', {
            color: {
                dark: '#00F',  // Blue dots
                light: '#0000' // Transparent background
            }
        }, function (err) {
            if (err) throw err
            console.log('done')
        })
    })

    it("解析二维码图片", () => {
        var p = path.resolve(__dirname, "../image/二维码.png");
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
                        console.log("gone with wind");
                    } else {
                        console.log(result.result); //结果
                    }
                };
                decodeQR.decode(image.bitmap);
            });
        })
    })
})

