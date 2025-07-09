import { RoomAmenities, RoomType } from "../utils/data_helper";


export interface User {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface MessageRequest {
  subject: string;
  content: string;
}

export interface Room {
  roomid: number,
  roomname: string,
  type: RoomType,
  accessible: boolean,
  roomPrice: number,
  image: string,
  features: RoomAmenities,
  description: string
}

export interface BookingDates {
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  depositpaid: boolean;
}
export interface BookingInfo {
  roomid: number,
  bookingid: number,
  firstname: string,
  lastname: string,
  room: string,
  depositpaid: boolean,
  checkin: string,
  checkout: string
}