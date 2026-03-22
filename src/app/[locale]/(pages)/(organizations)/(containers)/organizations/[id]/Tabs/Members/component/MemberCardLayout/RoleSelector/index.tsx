'use client'

import React, { useEffect, useState } from 'react'
import { Select } from 'src/components'
import useRoles, { Role } from 'src/components/hooks/useRoles'
import style from './roleSelector.module.scss'

type RoleSelectorProps = {
  initialRole: string;
  selectedRole: Role | null;
  setSelectedRole: (e: any) => void;
};

const RoleSelector = ({ initialRole, selectedRole, setSelectedRole }: RoleSelectorProps) => {
  // const [role, setRole] = useState<Role | null>(null);
  const { roles, loading } = useRoles();

  console.log("roles: ", roles);
  console.log("initialRole: ", initialRole);

  useEffect(() => {
    if (!initialRole || roles.length === 0) return;

    const foundRole = roles.find(r => r.value === initialRole);
    if (foundRole) {
      setSelectedRole(foundRole);
    }
  }, [initialRole, roles]);

  return (
    <Select
      wrapperStyle={style.select}
      options={roles}
      value={selectedRole}
      onChange={setSelectedRole}
      isLoading={loading}
    />
  );
};

export default RoleSelector;
