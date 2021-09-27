interface Enterprise {
  id: string;
  isRealEnterprise: boolean;
}

/**
 * Returns whether member is managed by a real enterprise
 * @param idEnterprise The members idEnterprise
 * @param enterprises Array of enterprises on the member
 * @returns Boolean
 */
export const isManaged = (idEnterprise: string, enterprises: Enterprise[]) => {
  return !!enterprises.find(
    ({ id, isRealEnterprise }) => id === idEnterprise && isRealEnterprise,
  );
};
