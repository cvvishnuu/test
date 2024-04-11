import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { OfflineBookingRequestDto } from '../dto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private readonly dealerCodeValidationEndpoint: string;
  private readonly partAndModelValidationEndpoint: string;

  constructor(private prisma: PrismaService) {
    this.dealerCodeValidationEndpoint = process.env.DEALER_CODE_VALIDATION_ENDPOINT;
    this.partAndModelValidationEndpoint = process.env.PART_MODEL_VALIDATION_ENDPOINT;
  }

  async createBooking(bookingInfo: OfflineBookingRequestDto): Promise<{ message: string; uuid: string }> {
    try {
      this.logger.log('Creating booking...');
      
      const isDealerValid = await this.validateDealerCode(bookingInfo.dealer?.dealerCode);
      const arePartAndModelValid = await this.validatePartAndModel(
        bookingInfo.vehicle?.partId,
        bookingInfo.vehicle?.modelId,
      );

      if (!isDealerValid || !arePartAndModelValid) {
        throw new Error('Invalid dealer code, partId, or modelId');
      }

      const UUID = this.generateUUID();
      console.log(UUID);
      const customerId = await this.createUser(bookingInfo);
      await this.createBookingEntity(bookingInfo, UUID, customerId);
      await this.createVehicle(bookingInfo, UUID);
      await this.createPayment(bookingInfo, UUID);

      return { message: 'Booking created successfully', uuid: UUID };
    } catch (error) {
      this.logger.error(`Failed to create booking: ${error.message}`);
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  public async createUser(bookingInfo: OfflineBookingRequestDto): Promise<number> {
    try {
      const existingUser = await this.prisma.customer.findFirst({
        where: {
          MobileNumber: bookingInfo.customer.phone,
        },
      });
    
      if (existingUser) {
        return existingUser.ID;
      }
    
      const newUser = await this.prisma.customer.create({
        data: {
          Name: bookingInfo.customer.name,
          MobileNumber: bookingInfo.customer.phone,
          Email: bookingInfo.customer.email,
          
        },
      });
  
      return newUser.ID;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  private async createBookingEntity(bookingInfo: OfflineBookingRequestDto, UUID: string, customerId: number): Promise<void> {
    try {
      await this.prisma.booking.create({
        data: {
          UUID: UUID,
          Customer: {
            connect: { ID: customerId } // Assuming `id` is the primary key of the Customer entity
          },
          Location: JSON.stringify(bookingInfo.location),
          HomeDeliverySelected: bookingInfo.homeDeliverySelected,
          DealerCode: bookingInfo.dealer.dealerCode,
          BranchCode: bookingInfo.dealer.branchCode,
          DealerPincode: bookingInfo.dealer.DealerPinCode,
          OnlineBooking: false,
          PreBooked: false,
          MerchandiseAndAccessories: "",
          BookingStatus: "Recieved",
          BookingNumber: 787,
          FrameNumber: "7676",
          OrderNumber: "88787",
          BookingSource: bookingInfo.bookingSource,
          BookingConfirmedDate: bookingInfo.bookingDate,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create booking entity: ${error.message}`);
    }
  }

  private async createVehicle(bookingInfo: OfflineBookingRequestDto, UUID: string): Promise<void> {
    try {
      await this.prisma.vehicle.create({
        data: {
          Model: bookingInfo.vehicle.description.model,
          Variant: bookingInfo.vehicle.description.variant,
          Color: bookingInfo.vehicle.description.color,
          PartID: bookingInfo.vehicle.partId,
          ModelID: bookingInfo.vehicle.modelId,
          ExShowRoomPrice: bookingInfo.vehicle.exShowRoomPrice, // Need to confirm
          OnRoadPrice: bookingInfo.vehicle.onRoadPrice, // Need to confirm
          VehicleType: bookingInfo.vehicle.evBooking ? 'EV' : 'ICE', // Need to confirm
          IsBTO: false,
          BookingUUID: UUID,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }
  }

  private async createPayment(bookingInfo: OfflineBookingRequestDto, UUID: string): Promise<void> {
    try {
      await this.prisma.payment.create({
        data: {
          OrderID: bookingInfo.paymentDetails.orderId,
          TransactionID: bookingInfo.paymentDetails.transactionId,
          PaymentStatus: bookingInfo.paymentDetails.paymentStatus,
          PaymentType: bookingInfo.paymentDetails.paymentType,
          AmountPaid: bookingInfo.paymentDetails.amountPaid,
          OnlinePayment: false, // Need to confirm
          BookingUUID: UUID,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  
  public async validateDealerCode(dealerCode: Number): Promise<boolean> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        this.dealerCodeValidationEndpoint,
        { dealerCode },
      );
  
      return response.data.isValid;
    } catch (error) {
      throw new Error(`Failed to validate dealer code: ${error.message}`);
    }
  }

  public async validatePartAndModel(partId: string, modelId: string): Promise<boolean> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        this.partAndModelValidationEndpoint,
        { partId, modelId },
      );
  
      return response.data.isValid;
    } catch (error) {
      throw new Error(`Failed to validate part and model: ${error.message}`);
    }
  }

  private generateUUID(): string {
    const uuid = uuidv4();
    return uuid.substring(0, 20);
  }
}
