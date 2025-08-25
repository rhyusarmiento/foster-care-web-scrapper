import * as fs from 'node:fs';
import * as path from 'node:path';

type JsonObject = { [key: string]: any };

// Read JSON array from file
function readJsonArray(filePath: string): JsonObject[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Update object(s) in the array by condition
function updateJsonArray(data: JsonObject[]): JsonObject[] {
  let count = 0;
  let newJSON = data.map(item => {
    item.rule.url = item.url;
    item.rule.forMDcontent = item.rule.htmlcontent;
    count++; 
    return item;
  });
  console.log('Number of rules updated:', count);
  return newJSON;
}

// Write updated array back to file (optional)
function writeJsonArray(filePath: string, data: JsonObject[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

let gstate = "Georgia"
let mstate = "Missouri"
let gJson: JsonObject[] = [];
let mJson: JsonObject[] = [];
const files = fs.readdirSync('./output');
let num = 0;
let gnum = 0;
let mnum = 0;
let gdoublicate: JsonObject[] = [];
let mdoublicate: JsonObject[] = [];
files.forEach(file => {
    const filePath = path.join('./output', file);
    let Json = readJsonArray(filePath);
    for (let item of Json) {
        if (item.rule.state.stateName === gstate) {
            gJson.push(item);
            
        } else if (item.rule.state.stateName === mstate) {
            mJson.push(item);
            
        }
        num++;
    }
});

for (let item of gJson) {
    let found = gJson.filter(i => i.rule.ruleName === item.rule.ruleName);
        if (found.length > 1) {
        gdoublicate.push(found);
    }
    gnum++;
}
for (let item of mJson) {
    let found = mJson.filter(i => i.rule.ruleName === item.rule.ruleName);
    if (found.length > 1) {
        mdoublicate.push(found);
    }
    mnum++;
}

console.log('duplicate rules in georgia:', gdoublicate);
console.log('duplicate rules in missouri:', mdoublicate);
console.log('Number of duplicate rules in georgia:', gdoublicate.length);
console.log('Number of duplicate rules in missouri:', mdoublicate.length);
console.log('Number of rules processed:', num);
console.log('Number of rules processed for georgia:', gnum);
console.log('Number of rules processed for missouri:', mnum);
