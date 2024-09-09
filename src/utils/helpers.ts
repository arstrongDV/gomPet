import React from 'react';
import axios from 'axios';
import IBAN from 'iban';
import numeral from 'numeral';
import { validatePolish } from 'validate-polish';

import { OptionType } from 'src/components/layout/Forms/Select';

export const getCounterLabel = (counter: number) => {
  return counter >= 100 ? '99+' : counter.toString();
};

export const correctPesel = (pesel: string): boolean => validatePolish.pesel(pesel);

export const checkNip = (nip: string): boolean => validatePolish.nip(nip);

export const correctBankNumber = (bankNumber: number | string) => {
  if (typeof bankNumber !== 'string') return false;
  const charArray = [...bankNumber];
  return Number.isNaN(Number(charArray[0])) && Number.isNaN(Number(charArray[1]))
    ? IBAN.isValid(bankNumber)
    : IBAN.isValid('PL' + bankNumber);
};

export const getFormattedAmount = (value: string | number, suffix = 'zł') =>
  numeral(value).format('0,0[.]00').replace(/,/g, ' ').replace(/\./, ',') + ` ${suffix}`;

export const getNumberAmount = (value: number) => value.toFixed(2);

export const toCommas = (value: number | string) => {
  const number = numeral(value).format('0.[0]').replace(/\./, ',');
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const toNumberFormat = (value: number | string) => {
  const number = numeral(value).format('0.[0]');
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const checkLink =
  (domain: string) =>
  (link: string | undefined): boolean =>
    Boolean(
      link?.match(new RegExp(/[\w#%+.:=@~-]{1,256}\.[\d()a-z]{1,6}\b([\w#%&()+./:=?@~-]*)?/gi)) ||
        link?.includes(domain)
    );

export const checkVideoLink = (videoLink: string) =>
  videoLink?.match(new RegExp(/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w/]+)(\?.*)?$/gim));

export const checkZipCode = (code: string) => /^\d{2}-\d{3}$/.test(code);

export const bytesToSize = (fileSizeInBytes: number) => {
  const byteUnits = [' kB', ' MB', ' GB', ' TB'];
  let index = -1;
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    index++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[index];
};

export const getBase64File = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Cannot read file');
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getDecodeBase64File = (base64: string) => {
  const binary = atob(base64.replace(/\s/g, ''));
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let index = 0; index < len; index++) {
    const code = binary.codePointAt(index);
    if (code) view[index];
  }

  return new Blob([view], { type: 'application/pdf' });
};

export const downloadFile = (file: Blob | File, name: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = name;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const calculateBoundingObj = (children: any) => {
  const boundingObject: { [index: string]: unknown } = {};

  React.Children.forEach(children, (child) => {
    const domNode = child.ref.current;
    boundingObject[child.key] = domNode?.getBoundingClientRect();
  });
  return boundingObject;
};

export const downloadFileFromUrl = (url: string) => {
  return axios({
    url,
    method: 'GET',
    responseType: 'blob'
  });
};

export const handleDueStep = (dueDate: string) => {
  const hoursQty = 12;
  const endDate = new Date(dueDate).getTime();
  const now = Date.now();
  return endDate - now < hoursQty * 3_600_000;
};

export const clearText = (text: string) => {
  return text.replace(/<\/?[^>]+(>|$)/g, '');
};

export const getFullURL = () => `${window.location.protocol}//${window.location.host}`;

export const getNotificationIdFromName = (errors: string[]) => {
  const array = [];

  for (const element of errors) {
    array.push(...element);
  }

  let sum = 1;
  for (const char of array) {
    const code = char.codePointAt(0);
    if (code) sum *= code;
  }

  if (sum === Number.POSITIVE_INFINITY) {
    sum = Math.random() * 1_000_000;
  } else {
    while (sum >= 1_000_000) {
      sum = sum / 2;
    }
  }

  return String(sum.toFixed(0));
};

export const getUrlFile = async (url: string) => {
  const response = await downloadFileFromUrl(url);
  const type = response.headers['content-type'] || 'application/pdf';
  const filename = url.split('/').pop() || 'file.pdf';
  const file = new File([response.data], filename, { type });

  return file;
};

export const toSelectOption = (value: string | number | null): OptionType => {
  if (!value) return null;
  return { value, label: String(value) };
};

export const getEnvName = () => {
  const NODE_ENV = process.env.NODE_ENV;
  return NODE_ENV || 'production';
};

export const isServer = () => typeof window === 'undefined';

export const getDaysAgo = (inputDate: string, showHours?: boolean): string => {
  const currentDate = new Date();
  const parsedDate = new Date(inputDate);

  const diffTime = Math.abs(currentDate.getTime() - parsedDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const sameDay =
    currentDate.getDate() === parsedDate.getDate() &&
    currentDate.getMonth() === parsedDate.getMonth() &&
    currentDate.getFullYear() === parsedDate.getFullYear();

  let formattedDate = '';

  if (diffDays === 0 && sameDay) {
    formattedDate = 'Dziś';
  } else if (diffDays <= 1 && !sameDay) {
    formattedDate = 'Wczoraj';
  } else if (diffDays <= 30) {
    formattedDate = `${diffDays} dni temu`;
  } else {
    formattedDate = `${parsedDate.toLocaleDateString()}`;
  }

  const hours = parsedDate.getUTCHours().toString().padStart(2, '0');
  const minutes = parsedDate.getUTCMinutes().toString().padStart(2, '0');

  return `${formattedDate}${showHours ? `, godz. ${hours}:${minutes}` : ''}`;
};
