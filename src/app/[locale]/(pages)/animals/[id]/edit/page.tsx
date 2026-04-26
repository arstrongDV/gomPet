'use client'

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { AnimalsApi } from 'src/api';
import { IAnimal } from "src/constants/types";

import AnimalUpdateForm from './index'
import { Loader } from "src/components";

type Parent = {
  name: string;
  // gender: Gender;
  id: number
  // relation: OptionType | string;
  photo?: string;
};


const AnimalEditPage = () => {
  const [animal, setAnimal] = useState<IAnimal | null>(null);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response_animal = await AnimalsApi.getAnimalProfile(Number(params.id));
        console.log('response_animal:', response_animal);
        setAnimal(response_animal.data);
      } catch (error) {
        console.error('Error fetching animal:', error);
        toast.error('Animal not found');
        // router.push('/animals');
      }
    };
    fetchAnimal();
  }, [params.id]);

  const handleSuccess = () => {
    router.refresh();
    router.push(`/animals/${params.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (!animal) {
    return <Loader />;
  }

  return (
    <AnimalUpdateForm 
      animal={animal} 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default AnimalEditPage;
