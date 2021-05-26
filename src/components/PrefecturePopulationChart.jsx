import { useEffect, useState } from 'react';
import axios from 'axios';

const PrefecturePopulationChart = ({ checkedPrefectures }) => {
  const baseURL = 'https://opendata.resas-portal.go.jp';
  const [data, setData] = useState([]); // グラフの描画用のデータ
  const [cache, setCache] = useState({}); // APIから取得したことのある都道府県とそのコードをキャッシュ
  const [fetchError, setFetchError] = useState(false);

  const copiedCheckedPrefectures = checkedPrefectures.map((pref) => ({
    ...pref,
  }));
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

    (async () => {
      const copiedCache = { ...cache };
      const existCheckedPrefectures = copiedCheckedPrefectures.length > 0;
      if (existCheckedPrefectures) {
        // 選択されている都道府県とキャッシュされている都道府県を比較してキャッシュにないものだけを取り出す
        // APIとの通信回数を減らすことができる
        const unfetchedPrefectures = Object.assign(
          {},
          ...copiedCheckedPrefectures
            .filter((pref) => !(pref.prefCode in copiedCache))
            .map((pref) => ({ [pref.prefCode]: pref.prefName })),
        );

        const existUnfetchedPrefecture =
          Object.keys(unfetchedPrefectures).length > 0;

        if (existUnfetchedPrefecture) {
          setCache((prev) => ({ ...prev, ...unfetchedPrefectures }));
          const populations = await Promise.all(
            Object.entries(unfetchedPrefectures).map(([code, name]) =>
              fetchPopulation(code, name),
            ),
          );

          const copiedData = data;
          if (data.length === 0) {
            for (let i = 0; i < populations.length; i += 1) {
              for (let j = 0; j < populations[i].data.length; j += 1) {
                if (i === 0) {
                  copiedData.push({ name: populations[i].data[j].year });
                }
                copiedData[j][populations[i].prefName] =
                  populations[i].data[j].value;
              }
            }
          } else {
            for (let i = 0; i < populations.length; i += 1) {
              for (let j = 0; j < populations[i].data.length; j += 1) {
                copiedData[j][populations[i].prefName] =
                  populations[i].data[j].value;
              }
            }
          }
          setData([...copiedData]);
        }
      }
    })();
  }, [data, cache, copiedCheckedPrefectures]);
};

export default PrefecturePopulationChart;
