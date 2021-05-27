import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PrefecturePopulationChart.module.css';

const PrefecturePopulationChart = ({ checkedPrefectures }) => {
  const baseURL = 'https://opendata.resas-portal.go.jp';
  const colors = [
    '#B71C1C',
    '#6D4C41',
    '#4E342E',
    '#E91E63',
    '#C2185B',
    '#C51162',
    '#9C27B0',
    '#F44336',
    '#009688',
    '#8E24AA',
    '#8E24AA',
    '#4CAF50',
    '#2196F3',
    '#CDDC39',
    '#C0CA33',
    '#42A5F5',
    '#FFEB3B',
    '#FDD835',
    '#0D47A1',
    '#2962FF',
    '#3F51B5',
    '#00BCD4',
    '#1A237E',
    '#1DE9B6',
    '#66BB6A',
    '#2E7D32',
    '#00C853',
    '#8BC34A',
    '#9CCC65',
    '#64DD17',
    '#AEEA00',
    '#F57F17',
    '#FFD600',
    '#FFC107',
    '#FFB300',
    '#FF6F00',
    '#FF9800',
    '#FB8C00',
    '#FF6D00',
    '#FF5722',
    '#FF7043',
    '#BF360C',
    '#795548',
    '#D50000',
    '#E65100',
    '#212121',
    '#FFAB00',
  ];
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
                  if (populations[i].data[j].year <= new Date().getFullYear()) {
                    copiedData.push({ name: populations[i].data[j].year });
                  }
                }
                if (populations[i].data[j].year <= new Date().getFullYear()) {
                  copiedData[j][populations[i].prefName] =
                    populations[i].data[j].value;
                }
              }
            }
          } else {
            for (let i = 0; i < populations.length; i += 1) {
              for (let j = 0; j < populations[i].data.length; j += 1) {
                if (populations[i].data[j].year <= new Date().getFullYear()) {
                  copiedData[j][populations[i].prefName] =
                    populations[i].data[j].value;
                }
              }
            }
          }
          setData([...copiedData]);
        }
      }
    })();
  }, [data, cache, copiedCheckedPrefectures]);
  const isPhone = window.innerWidth <= 600;

  return (
    <>
      {fetchError && <div>データ取得時にエラーが発生しました</div>}
      <div
        style={{
          width: '100%',
          height: isPhone ? 500 : 600,
          margin: '50px auto',
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              left: isPhone ? 5 : 20,
              top: 50,
              right: isPhone ? 100 : 200,
            }}
          >
            <XAxis dataKey="name" style={{ fontSize: isPhone ? 10 : 12 }}>
              <Label
                value="年度"
                position="right"
                offset={20}
                style={{ fontSize: isPhone ? 10 : 12 }}
              />
            </XAxis>
            <YAxis style={{ fontSize: isPhone ? 10 : 12 }}>
              <Label
                value="人口数"
                position="top"
                offset={20}
                style={{ fontSize: isPhone ? 10 : 12 }}
              />
            </YAxis>

            {checkedPrefectures.map((p, i) => (
              <Line
                type="linear"
                dataKey={p.prefName}
                stroke={colors[i]}
                dot={false}
                strokeWidth={1.5}
              />
            ))}
            <Legend
              align="right"
              verticalAlign="top"
              layout="vertical"
              wrapperStyle={{ right: isPhone ? 3 : 15, top: 20 }}
              content={(props) => {
                const { payload } = props;

                return (
                  <ul className={styles['legend-container']}>
                    {payload.map((entry) => (
                      <li
                        className={styles['list-item']}
                        style={{ color: entry.payload.stroke }}
                      >
                        {' '}
                        <span
                          style={{
                            color: 'black',
                            fontSize: isPhone ? 10 : 12,
                          }}
                        >
                          {entry.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default PrefecturePopulationChart;
