#!/usr/bin/env node
const fs = require("fs");

// 读取文件
// fs.readFile("./file/test.txt", "utf-8", (err, data) => {
//   console.log(err, data, "-----err-data");
// });

// fs.readFile("./file/test.txt", (err, data) => {
//   console.log(data, data.toString(), "-----err-data1");
// });


// 写入文件
// fs.writeFile('input.txt', '我是通 过fs.writeFile 写入文件的内容',  function(err) {
//     if (err) {
//         return console.error(err);
//     }
//     console.log("数据写入成功！");
//     console.log("--------我是分割线-------------")
//     console.log("读取写入的数据！");
//     fs.readFile('input.txt', function (err, data) {
//        if (err) {
//           return console.error(err);
//        }
//        console.log("异步读取文件数据: " + data.toString());
//     });
//  });


// var buf = new Buffer.alloc(9);

// console.log("准备打开已存在的文件！");

// for (var i = 0 ; i < 26 ; i++) {
//     buf[i] = i + 97;
//   }
  
//   console.log( buf.toString('ascii'));       // 输出: abcdefghijklmnopqrstuvwxyz
//   console.log( buf.toString('ascii',0,5));   //使用 'ascii' 编码, 并输出: abcde
//   console.log( buf.toString('utf8',0,5));    // 使用 'utf8' 编码, 并输出: abcde
//   console.log( buf.toString(undefined,0,5)); // 使用默认的 'utf8' 编码, 并输出: abcde


// fs.open('input.txt', 'r+', function(err, fd) {
//    if (err) {
//        return console.error(err);
//    }
//    console.log("文件打开成功！");
//    console.log("准备读取文件：");
//    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
//       if (err){
//          console.log(err);
//       }
//       console.log(bytes + "  字节被读取");
      
//       // 仅输出读取的字节
//       if(bytes > 0){
//          console.log(buf.slice(0, bytes).toString());
//       }
//    });
// });



// const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
// const json = JSON.stringify(buf);

// // 输出: {"type":"Buffer","data":[1,2,3,4,5]}
// console.log(json);

// const copy = JSON.parse(json, (key, value) => {
//   return value && value.type === 'Buffer' ?
//     Buffer.from(value.data) :
//     value;
// });
// console.log(copy);


// var buffer1 = Buffer.from(('菜鸟教程123'));
// var buffer2 = Buffer.from(('www.runoob.com'));
// var buffer3 = Buffer.concat([buffer1,buffer2]);
// console.log(buffer1,buffer2,buffer1.toString(),'----buffer1---buffer2----')
// console.log("buffer3 内容: " + buffer3.toString());

fs.mkdirSync('./国际化/')


