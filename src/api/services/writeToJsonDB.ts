import { writeFile } from 'fs/promises';
export async function writeToJsonDB(jsonFileName: string, data: Object) {
  try {
    await writeFile(jsonFileName, JSON.stringify(data), { encoding: 'utf-8' })
  } catch (error) {
    console.error(`write JSON file error: ${error}`);

  }

}