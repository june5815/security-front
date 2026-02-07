import Select from '@/shared/Select';
import useResidentStore from '@/lib/stores/useResidentStore';
import { useBuildingAndUnitOptions } from '@/shared/hooks/useBuildingAndUnitOptions';

export default function SelectFilters() {
  const { params, updateParams } = useResidentStore();
  const { buildingOptions, unitOptions } = useBuildingAndUnitOptions();

  return (
    <div className='flex items-center gap-4'>
      <span>
        <Select
          label='동'
          options={buildingOptions}
          value={String(params.building || 'all')}
          onChange={(v) => {
            if (v == 'all') {
              updateParams({building: undefined});
            } else {
              updateParams({building: Number(v)})
            }
          }}
        />
      </span>
      <span>
        <Select
          label='호수'
          options={unitOptions}
          value={String(params.unit || 'all')}
          onChange={(v) => {
            if (v == 'all') {
              updateParams({unit: undefined});
            } else {
              updateParams({unit: Number(v)})
            }
          }}
        />
      </span>
      <span>
        <Select
          label='거주'
          options={[
            {value: 'all', label: '전체'},
            {value: 'true', label: '세대주'},
            {value: 'false', label: '세대원'},
          ]}
          value={params.isHouseholder == undefined ? 'all' : String(params.isHouseholder)}
          onChange={(v) => {
            if (v === 'all') {
              updateParams({isHouseholder: undefined});
            } else if (v === 'true') {
              updateParams({isHouseholder: true})
            } else {
              updateParams({ isHouseholder: false });
            }
          }}
        />
      </span>
      <span>
        <Select
          label='위리브 가입'
          options={[
            {value: 'all', label: '전체'},
            {value: 'true', label: '가입'},
            {value: 'false', label: '미가입'},
          ]}
          value={params.isRegistered == undefined ? 'all' : String(params.isRegistered)}
          onChange={(v) => {
            if (v === 'all') {
              updateParams({isRegistered: undefined});
            } else if (v === 'true') {
              updateParams({isRegistered: true})
            } else {
              updateParams({ isRegistered: false });
            }
          }}
        />
      </span>
    </div>
  );
}
