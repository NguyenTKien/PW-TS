import { RoomType } from "./data_helper";

export function getRanDomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function getExtendImages(roomType: RoomType): string {
  if (roomType == RoomType.SINGLE) {
    return "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg";
  } else if (roomType == RoomType.DOUBLE) {
    return "https://images.pexels.com/photos/14021932/pexels-photo-14021932.jpeg"
  } else if (roomType == RoomType.FAMILY) {
    return "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg"
  } else if (roomType == RoomType.TWIN) {
    return "https://images.pexels.com/photos/11857305/pexels-photo-11857305.jpeg"
  }
  return "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg"; // Add a default return value or handle other cases
}