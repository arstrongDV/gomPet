/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Icon } from 'src/components';
import { createSwapy, SlotItemMap, Swapy } from 'src/plugins/swapy/instance';

import style from './PhotosOrganizer.module.scss';

type PhotosOrganizerProps = {
  photos: File[];
  setPhotos: (photos: File[]) => void;
};

const PhotosOrganizer = ({ photos, setPhotos }: PhotosOrganizerProps) => {
  const swapyRef = useRef<Swapy | null>(null);

  const items = useMemo(
    () => [
      ...photos.map((photo, index) => ({
        id: String(index + 1),
        file: photo
      }))
    ],
    [photos]
  );

  // Define a state for maintain the mapping between slots and items.
  const [slotItemsMap, setSlotItemsMap] = useState<SlotItemMap>([
    { slotId: '0', itemId: null },
    ...items.map((item) => ({
      slotId: item.id,
      itemId: item.id
    }))
  ]);

  // This is what you'll use to display your items.
  const slottedItems = useMemo(
    () =>
      slotItemsMap.map(({ slotId, itemId }) => ({
        slotId,
        itemId,
        item: items.find((item) => item.id === itemId)
      })),
    [items, slotItemsMap]
  );

  useEffect(() => {
    // Get the newly added items and convert them to slotItem objects
    const newItems = items
      .filter((item) => !slotItemsMap.some((slotItem) => slotItem.itemId === item.id))
      .map((item) => ({
        slotId: item.id,
        itemId: item.id
      }));

    // Remove items from slotItemsMap if they no longer exist in items
    const withoutRemovedItems = slotItemsMap.filter(
      (slotItem) => items.some((item) => item.id === slotItem.itemId) || !slotItem.itemId
    );

    const updatedSlotItemsMap = [...withoutRemovedItems, ...newItems];

    setSlotItemsMap(updatedSlotItemsMap);
    swapyRef.current?.setData({ array: updatedSlotItemsMap });
  }, [items]);

  // useEffect(() => {
  //   const container = document.querySelector('.container')!;
  //   swapyRef.current = createSwapy(container, {
  //     manualSwap: true
  //   });

  //   swapyRef.current.onSwap(({ data }: any) => {
  //     swapyRef.current?.setData({ array: data.array });
  //     setSlotItemsMap(data.array);
  //   });

  //   return () => {
  //     swapyRef.current?.destroy();
  //   };
  // }, []);

  return (
    <div className={classNames('container', style.container)}>
      {slottedItems.map(({ itemId, slotId, item }) => {
        const isHidden = itemId === null;
        const isMain =
          slottedItems.filter((i) => i.itemId !== null).sort((a, b) => parseInt(a.slotId) - parseInt(b.slotId))[0]
            ?.slotId === slotId;

        return (
          <div
            className={classNames(style.slot, {
              [style.hidden]: isHidden,
              [style.main]: isMain
            })}
            data-swapy-slot={slotId}
            key={slotId}
          >
            {/* ITEM */}
            {item ? (
              <div
                className={style.item}
                data-swapy-item={itemId}
                key={itemId}
              >
                <img
                  className={style.image}
                  src={URL.createObjectURL(item.file)}
                  draggable={false}
                  alt=''
                />

                {isMain && <div className={style.badge}>Główne</div>}

                <div className={style.overlay}>
                  <button
                    className={style.remove}
                    onClick={() => setPhotos(items.filter((i) => i.id !== itemId).map((i) => i.file))}
                    // onClick={() => {
                    //   const filter = slottedItems.filter((i) => i.itemId && i.itemId !== itemId);
                    //   const sorted = filter.sort((a, b) => parseInt(b.slotId) - parseInt(a.slotId));
                    //   setPhotos(sorted.map((i) => i.item?.file as File));
                    // }}
                  >
                    <Icon
                      name='x'
                      className={style.icon}
                    />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default PhotosOrganizer;