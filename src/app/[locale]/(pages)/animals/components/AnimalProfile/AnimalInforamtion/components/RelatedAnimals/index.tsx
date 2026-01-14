'use client'
import { IAnimal, IComment } from 'src/constants/types';
import AnimalCard from '../../../../AnimalCard';
import { AnimalsApi } from 'src/api';
import { useEffect, useState } from 'react';
import { HorizontalScroll, Loader } from 'src/components';
import style from './RelatedAnimals.module.scss'


const RelatedAnimals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  const fetchAnimals = async () => {
    setIsLoading(true);
    try {
      const response = await AnimalsApi.getAnimalsLatest(5, {});
      const animalsData = response.data || [];
      setAnimals(animalsData);
    } catch (err) {
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  if (animals === null) {
    return (
      <section>
        <Loader />
      </section>
    );
  }

    return(
      <HorizontalScroll className={style.list}>
        {isLoading && <Loader />}
        {animals.map((animal) => (
          <AnimalCard
            className={style.animal}
            key={animal.id}
            animal={animal}
          />
        ))}
      </HorizontalScroll>
    )
  }

  export default RelatedAnimals;