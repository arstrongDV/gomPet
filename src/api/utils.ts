import { AxiosError } from 'axios';
// import _ from 'lodash';

// import { notifyError } from 'src/components/layout/Toasts';

export const fileUploadHeaders = {
  'Content-Type': 'multipart/form-data'
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const apiErrorHandler = (error: any) => {
  if (!error.response?.data || error.message === 'canceled') {
    return [];
  }

  try {
    return process.env.ENV !== 'production'
      ? `Server: ${error.response.data.error}, (status: ${error.response.status})`
      : error.response.data.error;
  } catch (error_) {
    console.error('apiErrorHandler', error_);
    return 'Błąd sieci';
  }
};

export const isNetworkError = (err: AxiosError) => err.isAxiosError && !err.response;

const NETWORK_ERROR_NOTIFY_DURATION = 10_000;

const notifyNetworkError = () => {
  // notifyError('Błąd sieci');
  console.log('notifyNetworkError');
};

// export const throttledNotifyNetworkError = _.throttle(notifyNetworkError, NETWORK_ERROR_NOTIFY_DURATION, {
//   trailing: false
// });
