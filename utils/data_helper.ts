import path from "path";
import { BookingDates, BookingInfo, User } from "../common/interfaces";
import {
  getCurrentDate,
  getFutureDate,
  getRanDomNumber,
  readJsonData,
} from "./helper";
import { names } from "./data.json";

const jsonFilePath = path.resolve(__dirname, "./data.json");
const json = readJsonData(jsonFilePath);

export enum RoomType {
  SINGLE = "Single",
  TWIN = "Twin",
  DOUBLE = "Double",
  FAMILY = "Family",
  SUITE = "Suite",
}

export type RoomAmenities = {
  wifi: boolean;
  TV: boolean;
  Radio: boolean;
  Refreshment: boolean;
  safe: boolean;
  views: boolean;
};

export type RoomInfo = {
  roomName: string;
  type: RoomType;
  accessible: boolean;
  price: number;
  roomAmenities: RoomAmenities;
};

export const defaultRoomBooking: RoomInfo = {
  roomName: getRanDomNumber(100, 999).toString(),
  type: RoomType.DOUBLE,
  accessible: true,
  price: getRanDomNumber(100, 999),
  roomAmenities: {
    wifi: true,
    TV: true,
    Radio: false,
    Refreshment: true,
    safe: false,
    views: false,
  },
};

export const updateRoomBooking: RoomInfo = {
  roomName: getRanDomNumber(100, 999).toString(),
  type: RoomType.SUITE,
  accessible: true,
  price: getRanDomNumber(100, 999),
  roomAmenities: {
    wifi: false,
    TV: true,
    Radio: false,
    Refreshment: true,
    safe: false,
    views: true,
  },
};

export const defaultBooking: BookingInfo = {
  firstname: names[getRanDomNumber(0, names.length)],
  lastname: names[getRanDomNumber(0, names.length)],
  room: getRanDomNumber(100, 999).toString() || "102",
  depositpaid: true,
  checkin: getCurrentDate(),
  checkout: getFutureDate(2),
};

export const bookingcheck: BookingDates = {
  bookingdates: {
    checkin: getCurrentDate(),
    checkout: getFutureDate(3),
  },
  depositpaid: true,
};

export const bookingcheckupdate: BookingDates = {
  bookingdates: {
    checkin: getFutureDate(3),
    checkout: getFutureDate(5),
  },
  depositpaid: false,
};

export const user: User = {
  email: names[getRanDomNumber(0, names.length)] + "@gmail.com",
  firstname: names[getRanDomNumber(0, names.length)],
  lastname: names[getRanDomNumber(0, names.length)],
  phone: "09573953994",
};

export const userupdate: User = {
  email: names[getRanDomNumber(0, names.length)] + "@gmail.com",
  firstname: names[getRanDomNumber(0, names.length)],
  lastname: names[getRanDomNumber(0, names.length)],
  phone: "09573955576",
};