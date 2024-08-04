import { ToasterProps } from 'react-hot-toast';

export const toastsConfig: ToasterProps = {
  position: 'top-right',
  toastOptions: {
    duration: 5000,
    style: {
      padding: '1.6rem'
    },
    success: {
      iconTheme: {
        primary: '#277d23',
        secondary: '#ffffff'
      }
    }
  }
};
