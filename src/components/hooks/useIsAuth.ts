import { useAppSelector } from 'src/lib/store/hooks';

const useIsAuth = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  return isAuth;
};

export default useIsAuth;
