'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Dropdown,
  HorizontalScroll,
  Input,
  InputRadio,
  Modal,
  Pagination,
  Pill,
  Select,
  StarRating,
  SwitchButton,
  Tooltip
} from 'src/components';
import { OptionType } from 'src/components/layout/Forms/Select';

// import { notifySuccess } from 'src/components/layout/Toasts';
import style from './Library.module.scss';

const LibraryPage = () => {
  const [switch1, setSwitch1] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(4);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<OptionType>(null);
  const [radioValue, setRadioValue] = useState<string | null>(null);
  // const session = useSession();

  const options = [
    {
      value: '1',
      label: 'Option 1'
    },
    {
      value: '2',
      label: 'Option 2'
    }
  ];

  return (
    <div className={style.container}>
      <Card>
        <Accordion
          data={[
            {
              id: 1,
              header: 'Header 1',
              text: 'Text 1'
            },
            {
              id: 2,
              header: 'Header 2',
              text: 'Text 2'
            }
          ]}
        />
      </Card>

      <Card>
        <Tooltip content='Tooltip content'>
          <Button
            label='Button'
            icon='x'
          />
        </Tooltip>
        <Button
          label='Modal'
          empty
          onClick={() => setModalOpen(true)}
        />
        <Button
          label='Powiadomienie'
          empty
          onClick={() => toast.success('Success')}
        />
        <Modal
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          title='Modal'
        >
          <p>Text</p>
        </Modal>
      </Card>

      <Card>
        <Dropdown
          label='Dropdown'
          items={[
            {
              title: 'Title 1',
              roles: ['admin'],
              icon: 'x'
            },
            {
              title: 'Title 2',
              roles: ['admin'],
              icon: 'x'
            }
          ]}
        />
      </Card>

      <Card>
        <HorizontalScroll>
          <Card
            className={style.hsCard}
            color='gray'
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum commodo ex, a luctus turpis semper
            sed. In lorem tellus, molestie in lacus non, semper commodo nisi.
          </Card>
          <Card
            className={style.hsCard}
            color='gray'
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum commodo ex, a luctus turpis semper
            sed. In lorem tellus, molestie in lacus non, semper commodo nisi.
          </Card>
          <Card
            className={style.hsCard}
            color='gray'
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum commodo ex, a luctus turpis semper
            sed. In lorem tellus, molestie in lacus non, semper commodo nisi.
          </Card>
          <Card
            className={style.hsCard}
            color='gray'
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum commodo ex, a luctus turpis semper
            sed. In lorem tellus, molestie in lacus non, semper commodo nisi.
          </Card>
        </HorizontalScroll>
      </Card>

      <Card>
        <Pill>Pill</Pill>
      </Card>

      <Card>
        <Input label='Input' />
        <Select
          label='Select'
          options={options}
          value={selectValue}
          onChange={setSelectValue}
          isSearchable
          isClearable
        />
        <Checkbox label='Checkbox' />
        <InputRadio
          id='radio-1'
          value='1'
          label='Radio 1'
          checked={radioValue === '1'}
          onChange={() => setRadioValue('1')}
        />
        <InputRadio
          id='radio-2'
          value='2'
          label='Radio 2'
          checked={radioValue === '2'}
          onChange={() => setRadioValue('2')}
        />
        <Pagination
          currentPage={1}
          pageSize={10}
          totalCount={100}
          onPageChange={(page: number) => console.log(page)}
        />
      </Card>

      <Card>
        <StarRating
          rating={rating}
          onChange={setRating}
        />
        <StarRating
          rating={rating}
          onChange={setRating}
          readonly
        />
      </Card>

      <Card>
        <SwitchButton
          label='Switch'
          value={switch1}
          setValue={setSwitch1}
        />
        <SwitchButton
          label='Switch'
          value={switch1}
          setValue={setSwitch1}
          reverse
        />
      </Card>
    </div>
  );
};

export default LibraryPage;
