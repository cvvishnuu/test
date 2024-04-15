import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingConfirmationEmailDto, NonCpgIntegratedRequestDto,QueueModelDto } from '../dto';
import { InvalidDealerCodeException,InvalidPartOrModelIdException } from "../../shared/exceptions"
import { QueueDispatcherService } from '../../shared/dispatcher/queue-dispatcher.service';

@Injectable()
export class NonCpgIntegratedService {
  private readonly dealerCodeValidationEndpoint: string;
  private readonly partAndModelValidationEndpoint: string;

  constructor(private prisma: PrismaService,private queueDispatcherService:QueueDispatcherService) {
    this.dealerCodeValidationEndpoint = process.env.DEALER_CODE_VALIDATION_ENDPOINT;
    this.partAndModelValidationEndpoint = process.env.PART_MODEL_VALIDATION_ENDPOINT;
  }

  async saveBooking(bookingInfo: NonCpgIntegratedRequestDto): Promise<{ message: string; uuid: string }> {
    let UUID: string
    let bookingSuccessful = false
    try {

      // const isDealerValid = await this.validateDealerCode(bookingInfo.dealer?.dealerCode);
      // if (!isDealerValid) {
      //   throw new InvalidDealerCodeException();
      // }
      // const isPartIdAndModelIdCombinationValid = await this.validatePartAndModel(
      //   bookingInfo.vehicle?.partId,
      //   bookingInfo.vehicle?.modelId,
      // );

      // if (!isPartIdAndModelIdCombinationValid) {
      //   throw new InvalidPartOrModelIdException();
      // }

      UUID = this.generateUUID();

      const customerId = await this.saveUser(bookingInfo);
      await this.createBookingEntity(bookingInfo, UUID, customerId);
      await this.createVehicle(bookingInfo, UUID);
      await this.createPayment(bookingInfo, UUID);
      
      bookingSuccessful=true;

      return { message: 'Booking created successfully', uuid: UUID };
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data.message, error.response.status);
      } else {
        throw new InternalServerErrorException(`Failed to create booking: ${error}`);
      }
    }
    finally {
      if(bookingSuccessful){
      try {
        await this.emailDispatcher(bookingInfo, UUID);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

  private async saveUser(bookingInfo: NonCpgIntegratedRequestDto): Promise<number> {
    try {
      console.log("saving")
      const existingUserId = await this.checkUser(bookingInfo);
      console.log(existingUserId)
      if (existingUserId) {
        console.log("Hi")
        return existingUserId;

      }
      console.log("by")
      const newUser = await this.prisma.customer.create({
        data: {
          Name: bookingInfo.customer.name,
          MobileNumber: bookingInfo.customer.phone,
          Email: bookingInfo.customer.email,
          UserID:bookingInfo.customer.userId
        },
      });
      console.log(newUser)
      return newUser.ID;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(`Failed to create user: ${error}`);
    }
  }

  private async checkUser(bookingInfo: NonCpgIntegratedRequestDto): Promise<number|null> {
    try {
      const existingUser = await this.prisma.customer.findFirst({
        where: {
          MobileNumber: bookingInfo.customer.phone,
        },
      });
      if(existingUser){
        return existingUser.ID
      }
      return null
    } catch (error) {
      throw new InternalServerErrorException(`Failed to check user: ${error}`);
    }
  }

  private async createBookingEntity(bookingInfo: NonCpgIntegratedRequestDto, UUID: string, customerId: number): Promise<void> {
    try {
      await this.prisma.booking.create({
        data: {
          UUID: UUID,
          Customer: {
            connect: { ID: customerId }
          },
          Location: JSON.stringify(bookingInfo.location),
          HomeDeliverySelected: bookingInfo.homeDeliverySelected,
          DealerCode: bookingInfo.dealer.dealerCode,
          BranchCode: bookingInfo.dealer.branchCode,
          DealerPincode: bookingInfo.dealer.DealerPinCode,
          OnlineBooking: false,
          PreBooked: false,
          BookingStatus: "Received",
          BookingSource: bookingInfo.bookingSource,
          BookingConfirmedDate: bookingInfo.bookingDate,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create booking entity: ${error}`);
    }
  }

  private async createVehicle(bookingInfo: NonCpgIntegratedRequestDto, UUID: string): Promise<void> {
    try {
      await this.prisma.vehicle.create({
        data: {
          Model: bookingInfo.vehicle.description.model,
          Variant: bookingInfo.vehicle.description.variant,
          Color: bookingInfo.vehicle.description.color,
          PartID: bookingInfo.vehicle.partId,
          ModelID: bookingInfo.vehicle.modelId,
          ExShowRoomPrice: bookingInfo.vehicle.exShowRoomPrice,
          OnRoadPrice: bookingInfo.vehicle.onRoadPrice,
          VehicleType: bookingInfo.vehicle.evBooking ? 'EV' : 'ICE',
          IsBTO: false,
          BookingUUID: UUID,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create vehicle: ${error}`);
    }
  }

  private async createPayment(bookingInfo: NonCpgIntegratedRequestDto, UUID: string): Promise<void> {
    try {
      await this.prisma.payment.create({
        data: {
          OrderID: bookingInfo.paymentDetails.orderId,
          TransactionID: bookingInfo.paymentDetails.transactionId,
          PaymentStatus: bookingInfo.paymentDetails.paymentStatus,
          PaymentType: bookingInfo.paymentDetails.paymentType,
          AmountPaid: bookingInfo.paymentDetails.amountPaid,
          OnlinePayment: false,
          BookingUUID: UUID,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create payment: ${error}`);
    }
  }

  private async validateDealerCode(dealerCode: number): Promise<boolean> {
    try {
      const response = await axios.post(
        this.dealerCodeValidationEndpoint,
        { dealerCode },
      );

      return response.data.isValid;
    } catch (error) {
      throw new HttpException('Failed to validate dealer code', HttpStatus.BAD_REQUEST);
    }
  }

  private async validatePartAndModel(partId: string, modelId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        this.partAndModelValidationEndpoint,
        { partId, modelId },
      );

      return response.data.isValid;
    } catch (error) {
      throw new HttpException('Failed to validate part and model', HttpStatus.BAD_REQUEST);
    }
  }

  private async emailDispatcher(bookingInfo: NonCpgIntegratedRequestDto,Uuid:string): Promise<void> {
    const confirmationEmailModel:BookingConfirmationEmailDto= new BookingConfirmationEmailDto();
    const topicModel: QueueModelDto = new QueueModelDto();

    confirmationEmailModel.variant = bookingInfo.vehicle.description.variant ;
    confirmationEmailModel.email = bookingInfo.customer.email;
    confirmationEmailModel.phoneNumber = bookingInfo.customer.phone;
    confirmationEmailModel.amount = bookingInfo.paymentDetails.amountPaid;
    confirmationEmailModel.isBooked = true;
    confirmationEmailModel.name = bookingInfo.customer.name;
    confirmationEmailModel.vehicleModel = bookingInfo.vehicle.description.model;
    confirmationEmailModel.bookingDate = bookingInfo.bookingDate.toString();
    confirmationEmailModel.amountReceived = bookingInfo.paymentDetails.amountPaid.toString();
    confirmationEmailModel.uuid = Uuid;
    confirmationEmailModel.totalVehicleValue = Number(bookingInfo.vehicle.onRoadPrice);

    
    topicModel.context = 'Booking Confirmation';
    topicModel.data = JSON.stringify(confirmationEmailModel);
    topicModel.brand = bookingInfo.vehicle.evBooking?"EV":"Ice";
   
    await this.queueDispatcherService.dispatchConfirmation(topicModel)

  }

  private generateUUID(): string {
    const uuid = uuidv4();
    return uuid.substring(0, 20);
  }
}
