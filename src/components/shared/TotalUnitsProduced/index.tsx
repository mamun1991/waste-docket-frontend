import {useState, useRef} from 'react';
import dayjs from 'dayjs';
import {CSVLink} from 'react-csv';

function getTotalUnitsProducedArray(numberOfHours: number, totalUnitsProducedArray) {
  const currentTime = dayjs();
  const totalUnitsProducedHourlyData: any[] = [];
  for (let i = 0; i < numberOfHours; i++) {
    const hourAgo = currentTime.subtract(i, 'hour').format('H:00');
    const totalUnitsHoursAgo = totalUnitsProducedArray?.find(
      sectionData => sectionData.time === hourAgo
    );
    totalUnitsProducedHourlyData.push(totalUnitsHoursAgo);
  }

  return totalUnitsProducedHourlyData;
}

const TotalUnitsProduced = ({totalUnitsProduced, hourSelected, SelectHour, AllSections}) => {
  const totalUnitsDropDown = useRef<HTMLDivElement>(null);
  const [totalUnitsStatsClicked, setTotalUnitsStatsClicked] = useState(false);

  const closeTotalUnitsDropdown = e => {
    if (
      totalUnitsDropDown.current &&
      totalUnitsStatsClicked &&
      !totalUnitsDropDown.current.contains(e.target) &&
      !SelectHour.current.contains(e.target)
    ) {
      setTotalUnitsStatsClicked(false);
    }
  };

  document.addEventListener('mousedown', closeTotalUnitsDropdown);

  const allUnitsStatsData = AllSections?.map(e => ({time: e.time, quantity: e.partsCompleted}));
  const hourlyUnitsStatsData = getTotalUnitsProducedArray(
    parseInt(hourSelected, 10),
    allUnitsStatsData
  );

  return (
    <div
      className={`relative flex flex-col justify-center py-1 shadow-md cursor-pointer`}
      onClick={() => {
        totalUnitsStatsClicked ? setTotalUnitsStatsClicked(false) : setTotalUnitsStatsClicked(true);
      }}
      ref={totalUnitsDropDown}
    >
      {totalUnitsStatsClicked && hourlyUnitsStatsData && (
        <button className='absolute right-0 top-2 border-2 border-gray-100 underline px-2 text-lg text-gray-600 bg-white'>
          <CSVLink data={hourlyUnitsStatsData} filename={'Total Units Produced.csv'}>
            ↓
          </CSVLink>
        </button>
      )}
      <span className={'px-4 text-xs'}>{`Total Units Produced`}</span>
      <span className={'px-4 text-lg font-bold'}>{totalUnitsProduced}</span>
      <div
        className={`${
          !totalUnitsStatsClicked ? 'hidden' : ''
        } absolute z-10 w-full top-20 bg-white divide-y divide-gray-100 rounded-lg shadow  max-h-[315px] overflow-y-auto`}
      >
        <ul className='py-2 text-sm text-gray-600 bg-white'>
          {hourlyUnitsStatsData.map(el => (
            <li
              key={el?.time}
              className='flex justify-around px-4 py-2 hover:bg-primary hover:text-white'
            >
              <span className='font-bold'> {el?.time}</span>
              <span> {el?.quantity} </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TotalUnitsProduced;
