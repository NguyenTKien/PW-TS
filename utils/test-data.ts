import { RoomAmenities, RoomType } from "../pages/roomPage";

export const rooms: [string, RoomType, boolean, number, RoomAmenities][] = [
  [
    "101",
    RoomType.SINGLE,
    true,
    120,
    {
      wifi: true,
      TV: true,
      Radio: false,
      Refreshment: false,
      safe: false,
      views: false,
    },
  ],
  [
    "102",
    RoomType.DOUBLE,
    true,
    150,
    {
      wifi: true,
      TV: true,
      Radio: false,
      Refreshment: true,
      safe: false,
      views: false,
    },
  ],
  [
    "103",
    RoomType.FAMILY,
    true,
    180,
    {
      wifi: true,
      TV: true,
      Radio: true,
      Refreshment: false,
      safe: false,
      views: false,
    },
  ],
  [
    "104",
    RoomType.TWIN,
    true,
    200,
    {
      wifi: true,
      TV: true,
      Radio: false,
      Refreshment: true,
      safe: true,
      views: false,
    },
  ],
  [
    "105",
    RoomType.SUITE,
    true,
    250,
    {
      wifi: true,
      TV: true,
      Radio: true,
      Refreshment: false,
      safe: true,
      views: true,
    },
  ],
];
