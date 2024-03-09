export enum PayloadType {
  None = 0,
  UpdatePlayer = 1,
  UpdateQueue = 2,
  UpdateTrack = 4,
  UpdateActions = 8,
}

export type Payload = {
  Type: PayloadType;
};
