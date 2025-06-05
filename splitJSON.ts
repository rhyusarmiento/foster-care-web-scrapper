import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Splits an array into chunks of approximately equal size
 */
function splitArray<T>(array: T[], parts: number): T[][] {
    const result: T[][] = [];
    const len = array.length;
    const chunkSize = Math.ceil(len / parts);

    for (let i = 0; i < len; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }

    return result;
}

/**
 * Reads a JSON file, splits it into chunks, and writes them into separate files
 */
function splitJsonFile(inputFile: string, numberOfParts: number, outputDir: string): void {
    if (!fs.existsSync(inputFile)) {
        console.error(`File not found: ${inputFile}`);
        return;
    }

    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    if (!Array.isArray(jsonData)) {
        console.error('The JSON file must contain an array at the top level.');
        return;
    }

    const chunks = splitArray(jsonData, numberOfParts);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    chunks.forEach((chunk, index) => {
        const outputPath = path.join(outputDir, `part_${index + 1}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(chunk, null, 2));
        console.log(`Written ${outputPath}`);
    });
}

// Example usage
const inputPath = 'data.json';         // Path to the input JSON file
const outputDirectory = './output';     // Directory to save split files
const parts = 10;                        // Number of parts to split into

splitJsonFile(inputPath, parts, outputDirectory);
