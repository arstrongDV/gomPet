'use client'

import { Button, List, Pagination } from "src/components";
import AnimalCard from "../animals/components/AnimalCard";

import { Params } from 'src/constants/params';
import { useEffect, useState } from "react";
import { IAnimal } from "src/constants/types";
import { AnimalsApi } from "src/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'src/navigation';
import { useSession } from "next-auth/react";

import style from './myAnimals.module.scss'
import { paginationConfig } from "src/config/pagination";
import { Routes } from "src/constants/routes";

const MyAnimals = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const router = useRouter();
    const auth = useSession();

    const [animals, setAnimals] = useState<IAnimal[]>([])
    const [total, setTotal] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const changePage = (page: number) => {
        params.set(Params.PAGE, page.toString());
        router.push(`?${params.toString()}`);
      };

      const getMyAnimals = async () => {
        setIsLoading(true);
        try {
          const response = await AnimalsApi.getMyAnimals();
          console.log("Raw API response:", response.data);
      
          const animalsData: IAnimal[] = response.data.results || [];
      
          const myAnimals = animalsData.filter((res: IAnimal) => {
            return String(res.owner) === String(auth.data?.user?.id);
          });
          
          setAnimals(myAnimals);
          setTotal(response.data.count || myAnimals.length);
          console.log("myAnimals:", myAnimals);
        } catch (error) {
          console.error("Error fetching animals:", error);
          setAnimals([]);
          setTotal(0);
        } finally {
          setIsLoading(false);
        }
      };

    useEffect(() => {
        getMyAnimals();
    }, []);

    return(
        <div className={style.container}>
            <Button
                className={style.button}
                icon='plus'
                label={'add new'}
                onClick={() => router.push(Routes.NEW_ANIMAL)}
            />

            <div className={style.content}>
                <List 
                    className={style.list}
                    isLoading={isLoading}
                >
                    {animals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal} />
                    ))}
                </List>
            </div>
            
            <Pagination              
                className={style.pagination}
                totalCount={total}
                pageSize={paginationConfig.animals}
                currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
                onPageChange={changePage} 
            />
        </div>
    )
}
export default MyAnimals;