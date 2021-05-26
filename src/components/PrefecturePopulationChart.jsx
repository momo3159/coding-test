import { useEffect, useState } from 'react';
import axios from 'axios';

const PrefecturePopulationChart = ({ checkedPrefectures }) => {
  const baseURL = 'https://opendata.resas-portal.go.jp';
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchPopulation = async (prefCode, prefName) => {
      const response = await axios.get(
        `${baseURL}/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: { 'X-API-KEY': process.env.REACT_APP_API_KEY },
        },
      );

      if (response.status !== 200) {
        setFetchError(true);

        return [];
      }

      setFetchError(false);
      const population = response.data.result.data[0];
      population.prefName = prefName;

      return population;
    };
  });
};

export default PrefecturePopulationChart;
