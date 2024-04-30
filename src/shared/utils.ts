import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { InvalidDealerCodeException } from './exceptions';

export const generateUUID = (): string => {
  const uuid = uuidv4();
  return uuid.substring(0, 20);
};

export const validateDealerCode = async (dealerCode: number): Promise<void> => {
  const response = await axios.post(
    process.env.DEALER_CODE_VALIDATION_ENDPOINT!,
    {
      dealerCode,
    },
  );

  if (!(response && response.data && response.data.isValid)) {
    throw new InvalidDealerCodeException();
  }
};

export const validatePartAndModel = async (
  partId: string,
  modelId: string,
): Promise<void> => {
  const response = await axios.post(
    process.env.PART_MODEL_VALIDATION_ENDPOINT!,
    {
      partId,
      modelId,
    },
  );

  if (!(response && response.data && response.data.isValid)) {
    throw new InvalidDealerCodeException();
  }
};
