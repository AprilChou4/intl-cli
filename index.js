#!/usr/bin/env node
const fs = require("fs");
const xlsx = require("node-xlsx");
const chalk = require("chalk");
const { Command } = require("commander");
const packageDataE2J = require("./package.json");

function dataToJson(data, { rule, key: isKey, notMatchFilename }) {
  /**
   * excel读取规制解析，文件名为第一行(小写字母-大写字母 或 整个单元格内容)
   * rule 0:[4,15]表示第一列为语言key，第五列到第十九列为语言包数据，默认为0:[1,整行数据长度]
   */
  const [key, interval] = rule.split(":");
  const intervals = interval ? JSON.parse(interval) : [1];
  // 记录文件导成json的数据
  let jsonData = {};
  data.forEach((sheet) => {
    // 记录每个标签页的语言key
    let fileKeys = [];
    sheet.data.forEach((row, rowi) => {
      if (rowi === 0) {
        // 按第一行生成语言对象key
        row
          .splice(intervals[0], intervals[1] ?? row.length)
          .forEach((col, coli) => {
            if (notMatchFilename) {
              // 记录语言key
              fileKeys.push(col);
            } else {
              fileKeys.push(
                String(col).match(/[a-z]+-[A-Z]+/g)
                  ? col.match(/[a-z]+-[A-Z]+/g)[0]
                  : col
              );
            }
            jsonData[fileKeys[coli]] = {}; // 设置语言对象key
          });
      } else {
        // 将第一行一下的数据生成语言json对象
        if (isKey) {
          const data = row.splice(intervals[0], intervals[1] ?? row.length);
          fileKeys.forEach((filekey, i) => {
            console.log(
              chalk.green(
                `${sheet.name} | ${filekey} | ${row[key]} | ${data[i] ?? ""}`
              )
            ); // 打印数据日志
            jsonData[filekey][row[key]] = data[i] ?? "";
          });
        } else {
          row
            .splice(intervals[0], intervals[1] ?? row.length)
            .forEach((col, coli) => {
              console.log(
                chalk.green(
                  `${sheet.name} | ${fileKeys[coli]} | ${row[key]} | ${col}`
                )
              ); // 打印数据日志
              if (!fileKeys[coli] || !row[key]) return; // 没有文件key 或 数据key，跳过该列
              jsonData[fileKeys[coli]][row[key]] = col; // 设置每行数据到对应语言对象
            });
        }
      }
    });
  });
  return jsonData;
}

function writeFile(jsonData, options) {
  const { output, module } = options;
  // 获取输出路径及文件类型，默认为单前文件夹ts文件
  const [path, fileOrSuffix] = output.split("**");
  const [filename, suffix] = fileOrSuffix.split(".");
  // 需要export的文件类型
  const isExportType = ["ts", "js"];
  Object.keys(jsonData).forEach((key) => {
    console.log("正在写入文件:", path + key + fileOrSuffix);
    let old = {};
    // 格式化json数据
    let data = "";
    if (suffix === "txt") {
      Object.entries(jsonData[key]).forEach(([k, v]) => {
        data += `${module}Fe.${k}=${v}\n`;
      });
    } else {
      data =
        (isExportType.includes(suffix) ? "export default " : "") +
        JSON.stringify({ ...old, ...jsonData[key] }, undefined, "  ");
    }

    // 查看文件夹是否存在
    // fs.stat(path + key, async (_, stats) => {
    // if (!stats && filename) {
    fs.stat(path, async (_, stats) => {
      const outputFile = path + `${module}_${key}` + fileOrSuffix;
      if (!stats) {
        // 不存在创建文件夹
        await fs.mkdir(path, { recursive: true }, (err) => {
          if (err) {
            console.error(chalk.red(err));
          } else {
            // 文件写入
            fs.writeFile(outputFile, data, (err) => {
              if (err) {
                console.error(chalk.red(err));
              }
            });
          }
        });
      } else {
        // 文件写入
        fs.writeFile(outputFile, data, (err) => {
          if (err) {
            console.error(chalk.red(err));
          }
        });
      }
    });
  });
}

function excel2json(options) {
  const excel = fs.readFileSync(options.input);
  // 读取文件
  const workSheetsFromFile = xlsx.parse(excel);
  // 将数组转成json对象
  const jsonData = dataToJson(workSheetsFromFile, {
    rule: options.rule,
    key: options.key,
    notMatchFilename: options.notMatchFilename,
  });
  // 将对象写入文件
  writeFile(jsonData, options);
}

const program = new Command();

// 自定义标志<必须>：分为长短标识，中间用逗号、竖线或者空格分割；标志后面可跟必须参数或可选参数，前者用<>包含，后者用[]包含
// 版本输出
program
  .version(packageDataE2J.version, "-v, --version", "查看工具版本")
  .usage("<command> | [options]");

// 自定义选项参数
// .option('-n, --name <items1> [items2]', 'name description', 'default value')
program
  .option("-i, --input <file>", "必填，输入要导成json的xls、xlsx文件，可带路径")
  .option(
    "-r, --rule <key-col-num:key-col-interval>",
    "选填，解析表格规制，key-col-num为数据key列索引，key-col-interval为数据范围（如：0:[4,15]表示第一列为key，第五列到第十九列为数据），默认为0:[1]",
    "0:[1,2]"
  )
  .option("-m, --module <lng>", "模块", "etl")
  .option("-k, --key", "选填，已key为主体导出数据，没值时为空字符串")
  .option(
    "-o, --output <path>",
    "选填，输出文件路径及后缀配置(ts/js/json)，文件名或文件夹以**代替，文件存储路径不存在则自动创建，默认为./**.ts",
    "./国际化/**.txt"
  )
  .helpOption("-h, --help", "查看命令帮助文档");

// 报错时提示通过 -h 或 --help 查看命令帮助文档
program.showHelpAfterError("通过 -h 或 --help 查看命令帮助文档");

// 未知命令是唤起帮助
program
  .command("help", { isDefault: true })
  .description("查看命令帮助文档")
  .action(() => {
    if (program.args.includes("help") || program.args.length > 0) {
      program.outputHelp();
    }
  });

program.parse(process.argv);

// 默认没有命令参数时唤起帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

const options = program.opts();
// 当有文件输入时导出文件
if (options.input) excel2json(options);
