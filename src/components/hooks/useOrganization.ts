import { useAppSelector } from 'src/lib/store/hooks';

const useOrganization = () => {
  return {
    isOrgAuth: true,
    id: 1,
    name: 'Ratujemy Zwierzaki',
    image: null
  };
};

export default useOrganization;
