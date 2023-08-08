import fs from 'fs';
import path, { resolve } from 'path';
import PDFParser from 'pdf2json';
import xlsx from 'xlsx';

function extractPureTimeElementsWithIndex(array) {
  const timeRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;

  const pureTimeArray = array.reduce(function (acc, element, index) {
    // 使用正则表达式判断当前元素是否为时间格式
    if (timeRegex.test(element)) {
      // 如果是时间格式，则将该元素及其位置加入结果数组
      acc.push({ value: element, index: index });
    }
    return acc;
  }, []);

  return pureTimeArray;
}

function parse(filePath) {
  const pdfParser = new PDFParser();
  return new Promise((resolve, reject) => {
    let tableData = [];

    // 读取PDF文件
    const pdfFilePath = filePath;
    const pdfBuffer = fs.readFileSync(pdfFilePath);
    // 解析PDF文件
    pdfParser.parseBuffer(pdfBuffer);
    // 监听pdfParser的on('pdfParser_dataReady')事件
    pdfParser.on('pdfParser_dataReady', function (pdfData) {
      // 遍历每一页PDF中的文本块
      pdfData.Pages.forEach(function (page) {
        page.Texts.forEach(function (text) {
          // 判断文本块是否属于表格中的单元格
          // if (text.R[0].TS[2] === 10) {
          // 解析单元格的文本内容，将其添加到表格数据数组中
          const cellText = decodeURIComponent(text.R[0].T);
          tableData.push(cellText);
          // }
        });
      });

      // 打印解析出的表格数据
      const tags = extractPureTimeElementsWithIndex(tableData);
      const data = tags.map(({ value, index }) => {
        return [
          value,
          tableData[index + 2],
          tableData[index + 3],
          tableData[index + 4],
        ];
      });
      resolve(data);
    });
  });
}

function clearOrCreateDirectory(path) {
  if (fs.existsSync(path)) {
    // 文件夹已存在，清空文件夹内容
    fs.readdirSync(path).forEach((file) => {
      const filePath = `${path}/${file}`;
      fs.unlinkSync(filePath);
    });
  } else {
    // 文件夹不存在，创建文件夹
    fs.mkdirSync(path, { recursive: true });
  }
}

function moveFilesByExtension(sourceFolder, targetFolder, fileExtension) {
  // console.log(sourceFolder);
  // 读取源文件夹中的文件
  clearOrCreateDirectory(targetFolder);
  fs.readdir(sourceFolder, (err, files) => {
    if (err) {
      console.error('无法读取源文件夹:', err);
      return;
    }

    // 遍历每个文件
    files.forEach((file) => {
      const sourcePath = path.join(sourceFolder, file);

      // 检查文件是否以指定的文件名后缀结尾
      if (file.endsWith(fileExtension)) {
        const targetPath = path.join(targetFolder, file);

        // 移动文件到目标文件夹
        fs.rename(sourcePath, targetPath, (err) => {
          if (err) {
            console.error(`无法移动文件 ${file}:`, err);
          } else {
            console.log(`已移动文件 ${file} 到目标文件夹`);
          }
        });
      }
    });
  });
}

// 使用示例
const sourceFolder = path.resolve('./', './source');

const aPath = path.resolve('./', './发票');
// moveFilesByExtension(sourceFolder, aPath, '发票.pdf');
const bPath = path.resolve('./', './行程单');
// moveFilesByExtension(sourceFolder, bPath, '行程单.pdf');

function mergeData(filePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        reject(err);
        console.error('无法读取源文件夹:', err);
        return;
      }

      const all = Promise.all(
        files.map((file) => {
          console.log(filePath, file);
          return parse(path.resolve(filePath, file))
            .then((tripData) => {
              return tripData;
            })
            .catch((error) => {
              console.error('提取行程数据时发生错误:', error);
            });
        })
      );

      all.then((res) => {
        const allData = res.reduce((pre, cur) => {
          return [...pre, ...cur];
        }, []);
        resolve(allData);
        // console.log(allData);
      });
      // 遍历每个文件
    });
  });
}

setTimeout(() => {
  mergeData(bPath).then((injectData) => {
    const workbook = xlsx.readFile('./source/报销表格.xlsx');

    const worksheet = workbook.Sheets['Sheet2'];
    let startLine = 7;
    console.log(
      '报销总金额->',
      injectData.map((item) => Number(item[3])).reduce((pre, c) => pre + c, 0)
    );
    injectData.forEach((lineData, idx) => {
      let readLine = startLine + idx;
      const readCells = [
        `E${readLine}:F${readLine}`,
        `G${readLine}:H${readLine}`,
        `I${readLine}:J${readLine}`,
        `K${readLine}`,
      ];

      lineData.forEach((v, index) => {
        // 指定要写入的合并单元格
        const mergedCell = readCells[index];
        if (index === 3) {
          worksheet[mergedCell] = { v: Number(v), t: 'n' };
        } else {
          worksheet[mergedCell.split(':')[0]] = { v };
        }
      });
    });

    // 保存修改后的Excel文件
    xlsx.writeFile(workbook, `./表格结果/${new Date().getTime()}.xlsx`);
    console.log('Table writing success');
  });
}, 3000);
