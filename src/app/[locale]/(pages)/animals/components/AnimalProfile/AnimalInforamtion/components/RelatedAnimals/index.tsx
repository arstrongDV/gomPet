'use client'
import { IAnimal, IComment } from 'src/constants/types';
import AnimalCard from '../../../../AnimalCard';
import { AnimalsApi, OrganizationsApi } from 'src/api';
import { useEffect, useState } from 'react';
import { HorizontalScroll, Loader } from 'src/components';
import style from './RelatedAnimals.module.scss'

type RelatedAnimalsProps = {
  organizationId: number;
}

const RelatedAnimals = ({ organizationId }: RelatedAnimalsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  const fetchAnimals = async () => {
    setIsLoading(true);
    try {
      const response = await OrganizationsApi.getOrganizationAnimals(organizationId, {
        limit: 5
      });
      console.log(response)
      const animalsData = response.data.results || [];
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

  if (isLoading) {
    return <Loader />;
  }
  
  if (animals.length === 0) {
    return <div className={style.noAnimalsText}>
        <p>Brak Zwierzat</p>
      </div>;
  }
  
  return (
    <HorizontalScroll className={style.list}>
      {animals.map((animal) => (
        <AnimalCard
          className={style.animal}
          key={animal.id}
          animal={animal}
        />
      ))}
    </HorizontalScroll>
  );
}

  export default RelatedAnimals;