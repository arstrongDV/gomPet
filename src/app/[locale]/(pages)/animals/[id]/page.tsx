import { IAnimal } from 'src/constants/types';
import { IComment } from 'src/constants/types';
import { commentsMock } from 'src/mocks/comments';
import style from './AnimalProfile.module.scss';
import AnimalProfile from '../components/AnimalProfile';
import { AnimalsApi } from 'src/api';

// Async data fetching function
const getAnimalData = async (id: number): Promise<IAnimal | undefined> => {
  try {
    const res = await AnimalsApi.getAnimalProfile(id);
    return res.data;
  } catch (error) {
    console.error('Error fetching animal:', error);
    return undefined;
  }
};

// Sync function for mock comments
const getCommentData = (id: number): IComment | undefined => {
  return commentsMock.find(com => com.id === id);
};

export const generateMetadata = async ({ params: { id } }: { params: { id: string } }) => {
  const animalData = await getAnimalData(Number(id));
  
  return {
    title: animalData?.name || 'Unknown Animal',
    description: animalData?.species || 'Animal details',
    openGraph: {
      images: animalData?.image ? [animalData.image] : [],
    },
  };
};

// Make the page component async
const AnimalDetailPage = async ({ params }: { params: { id: string } }) => {
  // Await the data fetching
  const animal = await getAnimalData(Number(params.id));
  const comment = getCommentData(Number(params.id));

  if (!animal) {
    return <div className={style.notFound}>Animal not found</div>;
  }

  // if (!comment) {
  //   return <div className={style.notFound}>Comments not found</div>;
  // }

  return (
    <div className={style.mainContainer}>
      <div className={style.innerContainer}>
        <AnimalProfile animal={animal} /> 
      </div>
    </div>
  );
};

export default AnimalDetailPage;