
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

export class BookingInfo {
  constructor(
    public roomName: string,
    public type: RoomType,
    public accesssible: boolean,
    public price: number,
    public roomAmenities: RoomAmenities
  ) {}
}

export const defaultRoomBooking: BookingInfo = {
  roomName: "102",
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

export const updateRoomBooking: BookingInfo = {
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