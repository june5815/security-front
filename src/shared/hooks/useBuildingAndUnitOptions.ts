import useAuthStore from '@/lib/stores/useAuthStore';
import useApartmentDetailStore from '@/lib/stores/useApartmentDetailStore';
import { useEffect, useMemo } from 'react';

export const useBuildingAndUnitOptions = () => {
  const authentication = useAuthStore(state => state.authentication);
  const { data: apartment, updateParams: updateApartmentParams } = useApartmentDetailStore();

  useEffect(() => {
    if (authentication) {
      if (authentication.adminOf) {
        updateApartmentParams({id: authentication.adminOf!.id})
      } else if (authentication.resident) {
        updateApartmentParams({id: authentication.resident.apartmentId})
      }
    }
  }, [authentication]);

  const buildingOptions = useMemo(() => {
    const options = [{value: 'all', label: '전체'}];
    if (apartment) {
      options.push(
        ...apartment.buildings.map(building => ({value: String(building), label: `${building}동`}))
      )
    }
    return options;
  }, [apartment])

  const unitOptions = useMemo(() => {
    const options = [{value: 'all', label: '전체'}];
    if (apartment) {
      options.push(
        ...apartment.units.map(unit => ({value: String(unit), label: `${unit}호`}))
      )
    }
    return options;
  }, [apartment])

  return {buildingOptions, unitOptions};
}