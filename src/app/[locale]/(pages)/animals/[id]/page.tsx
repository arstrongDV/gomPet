import { IAnimal } from 'src/constants/types';
import { animalsMock } from 'src/mocks/animals';

import { IPost } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

import style from './AnimalProfile.module.scss'
import AnimalProfile from '../components/AnimalProfile';

const getAnimalData = (id: number): IAnimal | undefined => {
  return animalsMock.find(animal => animal.id === id);
};

const getPostsData = (animalId: number): IPost[] => {
  return postsMock.filter(post => post.author.id === animalId);
};
export const generateMetadata = ({ params: { id } }: { params: { id: string } }) => {
  const animalData = getAnimalData(Number(id));
  // const postData = getPostsData(Number(id));

  return {
    title: animalData?.name || 'Unknown Animal',
    description: animalData?.species || 'Animal details',
    openGraph: {
      images: animalData?.image ? [animalData.image] : [],
    },
  };
};



const AnimalDetailPage = ({ params }: { params: { id: string } }) => {
  const animal = getAnimalData(Number(params.id));
  const posts = getPostsData(Number(params.id));
  if (!animal || !posts) {
    return <div>Animal not found</div>;
  }
  return (
<div className={style.mainContainer}>
    <div className={style.innerContainer}>
      <AnimalProfile animal={animal} posts={posts}/>
    </div>
</div>

  );
};

export default AnimalDetailPage;
