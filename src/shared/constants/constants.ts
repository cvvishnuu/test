export enum API_ROUTE {
  BOOKINGS = 'bookings',
  OFFLINE = 'offline',
}

export enum EXCEPTION_MESSAGE {
  UNKNOWN_ERROR = 'unknown error',
  PRISMA_INITIALIZATION_ERROR = 'Failed to initialize database client',
  PRISMA_UNKNOWN_REQUEST_ERROR = 'Unknown request error occurred',
  INVALID_DEALER_CODE = 'Invalid dealer code',
  INVALID_PARTID_MODELID = 'Invalid partId or modelId',
  CREATE_BOOKING_FAILED = 'Failed to create booking',
}

export enum BOOKING_STATUS {
  INITIATED = 'Initiated',
  RECIEVED = 'Recieved',
  CONFIRMED = 'Confirmed',
  MANUFACTURED = 'Manufactured',
  PACKED = 'Packed',
  DISPATCHED = 'Dispatched',
}

export enum VEHICLE_TYPE {
  EV = 'EV',
  ICE = 'ICE',
}

export enum RESPONSE_MESSAGE {
  BOOKING_CREATED = 'Booking created successfully',
}

export enum COMMUNICATION_CONTEXT {
  CONFIRMATION = 'Booking Confirmation',
}
