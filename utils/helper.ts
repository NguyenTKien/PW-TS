import path from "path";
import { RoomType } from "./data_helper";
import * as fs from 'fs';

const jsonFilePath = path.resolve(__dirname, './data.json');
const json = readJsonData(jsonFilePath);

export function getRanDomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTheDateFromCurrectDate(days: number): number {
  const futureDate = getFutureDate(days);
  const date = new Date(futureDate);
  return date.getDate();
}

export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function getFirstDateOfMonth(): string { 
  const date = new Date();
  return date.getFullYear.toString + "-" + date.getMonth.toString + "-" + "01";
}

export function saveJsonData(file_path: string, json: string) {
  try {
    const jsonData = fs.writeFileSync(file_path, JSON.stringify(json))
    return jsonData
  } catch (err) {
    console.error("Fail to read json file. Error: " + err)
  }
}

export function readJsonData(file_path: string) {
  try {
    const jsonString = fs.readFileSync(file_path, "utf-8")
    const jsonData = JSON.parse(jsonString)
    return jsonData
  } catch (err) {
    console.error("Fail to read json file. Error: " + err)
    return null; // Return null if there's an error
  }
}

export function getExtendImages(roomType: RoomType): string {
  if (roomType == RoomType.SINGLE) {
    return json.imageUrl.Single ;
  } else if (roomType == RoomType.DOUBLE) {
    return json.imageUrl.Double
  } else if (roomType == RoomType.FAMILY) {
    return json.imageUrl.Family
  } else if (roomType == RoomType.TWIN) {
    return json.image.Twin
  }
  return json.image.Suite; // Add a default return value or handle other cases
}