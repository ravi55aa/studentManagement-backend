import { serviceReturnType } from '../Constants/interfaces';
import { IResponse } from '../Interfaces/Other/IResponse';
import { IAddress } from '../Models/addressModel';

export const handleAddressResponseBody = (
  message: string,
  data: Partial<IAddress | null>,
): serviceReturnType => {
  const status = data ? 200 : 409;
  const resBody: IResponse<Partial<IAddress | null>> = {
    success: data ? true : false,
    message: data ? 'AddressFetchedSuccessfully' : 'Something went Error',
    data: data,
    error: data ? null : 'Something went error',
  };

  return {
    status,
    resBody,
  };
};
