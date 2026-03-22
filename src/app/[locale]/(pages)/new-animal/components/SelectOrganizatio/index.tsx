'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Select } from "src/components";
import { AnimalsApi, OrganizationsApi } from "src/api";
import { IOrganization } from "src/constants/types";
import style from './SelectOrganization.module.scss';
import { OptionType } from "src/components/layout/Forms/Select";
import { useTranslations } from "next-intl";

type SelectOrganizationProps = {
  setOrganization: (orgId: number | null) => void;
  setOwner: (ownerId: number | null) => void;
  initialOrganization?: OptionType;
};

type ExtendedOptionType = OptionType & {
  type: "ORGANIZATION" | "OWNER";
};

const SelectMyOrganizations = ({ setOrganization, setOwner, initialOrganization }: SelectOrganizationProps) => {
  const session = useSession();
  const t = useTranslations();
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OptionType | null>(null);
  const [hasSetInitial, setHasSetInitial] = useState(false); // <-- track if we applied initialOrganization

  // Fetch user's organizations
  useEffect(() => {
    if (!session.data?.access_token) return;

    const fetchOrgs = async () => {
      try {
        const res = await AnimalsApi.getUsersOrganization(session.data.access_token);
        setOrganizations(res.data.results || []);

        console.log("ress: ", res.data.results);
        console.log("initialOrganization: ", initialOrganization);

        // // Apply initialOrganization only once
        // if (initialOrganization && !hasSetInitial) {
        //   const matchedOrg = res.data.results.find(
        //     (org: IOrganization) =>
        //       org.organization?.id === initialOrganization.value
        //   );
        //   if (matchedOrg) {
        //     setSelectedOrg({
        //       label: matchedOrg.organization.name,
        //       value: matchedOrg.organization.id
        //     });
        //   }
        //   setHasSetInitial(true);
        // }
      } catch (err) {
        console.error("Error fetching organizations:", err);
        setOrganizations([]);
      }
    };

    fetchOrgs();
  }, [session.data?.access_token]);

  // Notify parent whenever selection changes
  useEffect(() => {
    if (!selectedOrg) return;
  
    if (selectedOrg.type === "ORGANIZATION") {
      setOrganization(Number(selectedOrg.value));
      setOwner(null);
    }
  
    if (selectedOrg.type === "OWNER") {
      setOrganization(null);
      setOwner(Number(selectedOrg.value));
    }
  }, [selectedOrg]);

  // Map organizations to Select options
  const options: OptionType[] = organizations.map(org => ({
      label: org.label === "noOrganization"
      ? t(`pages.newAnimal.${org.label}`)
      : org.label,
    value: org.organization_id ?? org.owner_id,
    type: org.organization_id ? "ORGANIZATION" : "OWNER"
  }));

  useEffect(() => {
    if (!initialOrganization || hasSetInitial || options.length === 0) return;
  
    const foundOption = options.find(
      (opt) => opt.value === initialOrganization.value
    );
  
    if (foundOption) {
      setSelectedOrg(foundOption);
    }
  
    setHasSetInitial(true);
  }, [initialOrganization, options, hasSetInitial]);

  if (organizations.length === 0) return null;

  return (
    <Select
      wrapperStyle={style.select}
      label="Wybierz swoją organizację"
      options={options}
      value={selectedOrg ? selectedOrg : options[0]}
      onChange={(option: OptionType) => setSelectedOrg(option)}
      // isClearable
      isSearchable
    />
  );
};

export default SelectMyOrganizations;