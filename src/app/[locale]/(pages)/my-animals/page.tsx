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
import toast from "react-hot-toast";

const MyAnimals = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const router = useRouter();
    const auth = useSession();

    const [animals, setAnimals] = useState<IAnimal[]>([])
    const [total, setTotal] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openedCardId, setOpenedCardId] = useState<string | null>(null);

    const handleToggleSettings = (id: string) => {
      setOpenedCardId((prev) => (prev === id ? null : id));
    };

    const changePage = (page: number) => {
        params.set(Params.PAGE, page.toString());
        router.push(`?${params.toString()}`);
      };

      const getMyAnimals = async (page: number = 1) => {
        setIsLoading(true);
        try {
          const response = await AnimalsApi.getAnimals({
            page: page,
            limit: paginationConfig.animals
          });

          const animalsData: IAnimal[] = response.data.results || [];
          const myAnimals = animalsData.filter((res: IAnimal) => {
            return String(res.owner) === String(auth.data?.user?.id);
          });
          console.log("myAnimals:::", myAnimals)
          setAnimals(myAnimals);
          console.log("response:::", response)
          setTotal(myAnimals.length);
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

    useEffect(() => {
      const currentPage = params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1;
      getMyAnimals(currentPage);
    }, [params.get(Params.PAGE)]); // Add page as dependency

    const handleDeleteAnimal = async (id: number) => {
      try {
        // Optimistic update: remove from UI first
        setAnimals(prevAnimals => prevAnimals.filter(animal => animal.id !== id));
        setTotal(prevTotal => prevTotal - 1);
        
        const res = await AnimalsApi.deleteAnimal(id);
        console.log(res)
        if (res.status == 204) {

          toast.success("Animal deleted!");
        } else {
          await getMyAnimals(params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1);
          toast.error("Failed to delete animal");
        }
      } catch (err) {

        await getMyAnimals(params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1);
        console.log(err);
        toast.error("Failed to delete animal");
      }
    };

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
                {animals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    isSettingsOpen={openedCardId === String(animal.id)} ////////// String
                    onToggleSettings={() => handleToggleSettings(String(animal.id))} ////////// String
                    onDelete={handleDeleteAnimal} 
                    setOpenedCardId={setOpenedCardId}
                  />
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