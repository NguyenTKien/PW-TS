import { RoomAmenities, RoomType } from "../utils/data_helper";

export interface BookingDates {
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  depositpaid: boolean;
}

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
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

export interface BookingInfo {
  firstname: string, 
  lastname: string,
  room: string,
  depositpaid: boolean,
  checkin: string,
  checkout: string
}