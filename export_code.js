// export_code.js
const fs = require('fs');
const path = require('path');

// 읽을 폴더 및 파일 확장자 설정
const targetDirs = ['app', 'components', 'lib', 'prisma'];
const targetExts = ['.ts', '.tsx', '.css', '.prisma', '.json'];
const ignoreFiles = ['package-lock.json', 'components.json', 'tsconfig.json'];

const outputFile = 'project_source.txt';
let output = '';

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      if (targetExts.includes(path.extname(file)) && !ignoreFiles.includes(file)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        output += `\n========================================\n`;
        output += `FILE PATH: ${fullPath}\n`;
        output += `========================================\n`;
        output += content + '\n';
      }
    }
  });
}

// 1. 주요 폴더 스캔
targetDirs.forEach(dir => scanDirectory(dir));

// 2. 루트의 중요 파일 추가
['package.json', 'next.config.ts'].forEach(file => {
    if(fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        output += `\n=== ROOT FILE: ${file} ===\n${content}\n`;
    }
});

fs.writeFileSync(outputFile, output);
console.log(`✅ 소스 코드 추출 완료! '${outputFile}' 파일을 업로드해주세요.`);