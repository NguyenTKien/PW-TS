import {
  BookingDates,
  User,
} from "../common/interfaces";
import { getCurrentDate, getFutureDate, getRanDomNumber } from "./helper";

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

export class RoomInfo {
  constructor(
    public roomName: string,
    public type: RoomType,
    public accesssible: boolean,
    public price: number,
    public roomAmenities: RoomAmenities
  ) {}
}

export class BookingInfo {
  constructor(
    firstName: string,
    lastName: string,
    room: RoomInfo["roomName"],
    depositPaid: boolean,
    checkIn: string,
    checkOut: string
  ) {}
}

export const defaultRoomBooking: RoomInfo = {
  roomName: getRanDomNumber(100, 999).toString(),
  type: RoomType.DOUBLE,
  accesssible: true,
  price: 150,
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
  roomName: "103",
  type: RoomType.SUITE,
  accesssible: true,
  price: 200,
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
  firstName: "John",
  lastName: "Doe",
  room: defaultRoomBooking.roomName,
  depositPaid: true,
  checkIn: getCurrentDate(),
  checkOut: getFutureDate(2),
};

export const bookingcheck: BookingDates = {
  bookingdates: {
    checkin: "2025-03-17",
    checkout: "2025-03-20",
  },
  depositpaid: true,
};

export const bookingcheckupdate: BookingDates = {
  bookingdates: {
    checkin: "2025-03-19",
    checkout: "2025-03-22",
  },
  depositpaid: false,
};

export const user: User = {
  email: "alohaap09@gmail.com",
  firstname: "Alovado",
  lastname: "Christina",
  phone: "09573953994",
};

export const userupdate: User = {
  email: "kimushaki@gmail.com",
  firstname: "Haloda",
  lastname: "Hisamu",
  phone: "09573955576",
};
