import classNames from 'classnames';
import { Icon } from 'src/components';
import { IAnimal, IComment } from 'src/constants/types';
import style from './RelatedAnimals.module.scss';
import { IconNames } from 'src/assets/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import AnimalCard from '../../../../AnimalCard';


type AnimalProfileProps = {
    animal: IAnimal & {
      comments: IComment[]; 
      images: string[];
      characteristicBoard: { title: string; bool: boolean }[];
    }
}

const RelatedAnimals = ({ animal }: AnimalProfileProps) => {

    return(
        <AnimalCard
          key={animal.id}
          animal={animal}
        />
    )
  }

  export default RelatedAnimals;