'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Select } from 'src/components';
import useRoles, { Role } from 'src/components/hooks/useRoles';

import style from './roleSelector.module.scss';

type RoleSelectorProps = {
  initialRole: string;
  selectedRole: Role | null;
  setSelectedRole: (e: any) => void;
};

const RoleSelector = ({ initialRole, selectedRole, setSelectedRole }: RoleSelectorProps) => {
  const t = useTranslations();
  const { roles, loading } = useRoles();

  const options = roles.map(role => ({
    value: role.value,
    label: t(`common.roles.${role.label}`),
    key: role.label
  }));

  useEffect(() => {
    const isObject = typeof selectedRole === 'object' && selectedRole !== null && 'value' in selectedRole;

    if (options.length > 0 && (!selectedRole || !isObject)) {
      let foundRole: { value: string | number; label: string; key: string } | undefined;
      foundRole = options.find(r => r.key === initialRole);
      
      if (foundRole) {
        setSelectedRole(foundRole);
      }
    }
  }, [options, initialRole, selectedRole, setSelectedRole]);

  return (
    <Select
      wrapperStyle={style.select}
      options={options}
      value={selectedRole}
      onChange={setSelectedRole}
      isLoading={loading}
    />
  );
};

export default RoleSelector;
