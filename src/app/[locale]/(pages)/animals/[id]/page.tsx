import { IAnimal, IPost } from 'src/constants/types';
import { IComment } from 'src/constants/types';
import { commentsMock } from 'src/mocks/comments';
import style from './AnimalProfile.module.scss';
import { AnimalsApi, PostsApi } from 'src/api';
import TabView from '../components/AnimalProfile/TabView';

const getAnimalData = async (id: number): Promise<IAnimal | undefined> => {
  try {
    const animalProfileRes = await AnimalsApi.getAnimalProfile(id);
    return animalProfileRes.data
  } catch (error) {
    return undefined;
  }
};

const getAnimalsFollowers = async (target_id: number) => {
  try {
    const animalFollowersRes = await PostsApi.Following(
      'animals.animal',
      target_id
    );
    return animalFollowersRes.data.followers_count;
  } catch(err) {
    return 0;
  }
};

const getAnimalFamilyTree = async (id: number): Promise<IAnimal | undefined> => {
  try {
    const animalFamilyTreeRes = await AnimalsApi.getAnimalFamilyTree(id); 
    return animalFamilyTreeRes.data
  } catch (error) {
    console.error('Error fetching animal:', error);
    return undefined;
  }
};

// const getAnimalPosts = async (id: number): Promise<IPost | undefined> => {
//   try{
//     const animalPosts = await PostsApi.getAnimalPosts(id);
//     return animalPosts.results
//   }catch(error){
//     throw error
//   }
// }

const getCommentData = async (id: number): Promise<IComment | undefined> => {
  try {
    // const animalCommentsRes = await AnimalsApi.getAnimalComments(id);
    const animalCommentsRes = await PostsApi.getComments(id, "users.organization", {
      limit: 2
    });
    console.log("animalCommentsResanimalCommentsRes: ", animalCommentsRes);
    return animalCommentsRes.results || [];
  } catch (error) {
    console.error('Error fetching animal:', error);
    return [];
  }
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

const AnimalDetailPage = async ({ params }: { params: { id: string } }) => {
  const animal = await getAnimalData(Number(params.id));
  const familyTree = await getAnimalFamilyTree(Number(params.id));
  const comments = animal?.organization
  ? await getCommentData(animal.organization.id)
  : [];
  const followers = await getAnimalsFollowers(Number(params.id));
  // const posts = await getAnimalPosts(Number(params.id))

  if (!animal) {
    return <div className={style.notFound}>Animal not found</div>;
  }
//posts={posts}
  return (
    <div className={style.mainContainer}>
      <div className={style.innerContainer}>
        {/* <AnimalProfile animal={animal} comment={comment} posts={posts} familyTree={familyTree} />  */}
        <TabView animal={animal} followers={followers} comments={comments} familyTree={familyTree} /> 
      </div>
    </div>
  );
};

export default AnimalDetailPage;