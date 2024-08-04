'use client';

import React, { useEffect, useState } from 'react';

import { OffersApi } from 'src/api';
import { useIsAuth } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Link } from 'src/navigation';

import style from './Offers.module.scss';

const Offers = () => {
  const isAuth = useIsAuth();
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    const getOffers = async () => {
      if (!isAuth) return;

      try {
        const { data } = await OffersApi.getOffers();
        setOffers(data?.offers || []);
      } catch (e) {
        console.error(e);
      }
    };

    getOffers();
  }, [isAuth]);

  return (
    <div>
      <h1>Offers</h1>
      {!isAuth && <p>You need to be logged in to see the offers</p>}
      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            <Link href={Routes.OFFER(offer.id)}>{offer?.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Offers;
