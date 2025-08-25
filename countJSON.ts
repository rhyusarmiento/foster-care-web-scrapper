import * as fs from 'node:fs';
import * as path from 'node:path';

type JsonObject = { [key: string]: any };

// Read JSON array from file
function readJsonArray(filePath: string): JsonObject[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Update object(s) in the array by condition
function countJson(data: JsonObject[]): number {
  let count = 0;
  let newJSON = data.map(item => {
    count++; 
    return item;
  });
  console.log('Number of rules updated:', count);
  return count;
}

// Write updated array back to file (optional)
function writeJsonArray(filePath: string, data: JsonObject[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


const files = fs.readdirSync('./output');
let num = 1;
let totalRules = 0;
files.forEach(file => {
    const filePath = path.join('./output', file);
    let Json = readJsonArray(filePath);
    const newPath = path.join('./outputNew', `rulesNewJson_${num}.json`);
    totalRules = totalRules + countJson(Json);
    num++;
});
console.log('Number of rules processed:', num - 1);
console.log('Total number of rules:', totalRules);
