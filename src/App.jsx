import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import CheckboxWithLabel from './components/CheckBoxWithLabel';
import PrefecturePopulationChart from './components/PrefecturePopulationChart';
import styles from './App.module.css';

const App = () => {
  const baseURL = 'https://opendata.resas-portal.go.jp';
  const [fetchError, setFetchError] = useState(false);
  const [prefectures, setPrefectures] = useState([]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      const response = await axios.get(`${baseURL}/api/v1/prefectures`, {
        headers: { 'X-API-KEY': process.env.REACT_APP_API_KEY },
      });

      return response;
    };

    (async () => {
      const response = await fetchPrefectures();
      if (response.status !== 200) setFetchError(true);
      else {
        setFetchError(false);
        const prefs = response.data.result.map((obj) => ({
          ...obj,
          isChecked: false,
        }));
        // 見本のために東京と大阪をはじめに表示しておく
        prefs[12].isChecked = true;
        prefs[26].isChecked = true;
        setPrefectures(prefs);
      }
    })();
  }, []);

  return (
    <div className="App">
      <Header title="Title" />
      <p className={styles.heading}>都道府県</p>
      {fetchError && <div>データの取得に失敗しました リロードしてください</div>}
      <div className={styles['checkbox-container']}>
        {prefectures.map((pref, idx) => (
          <CheckboxWithLabel
            key={prefectures.prefCode}
            id={prefectures.prefCode}
            value={pref.prefName}
            ischecked={pref.isChecked}
            onChange={() => {
              prefectures[idx].isChecked = !prefectures[idx].isChecked;
              setPrefectures([...prefectures]);
            }}
            label={pref.prefName}
          />
        ))}
      </div>
      <PrefecturePopulationChart
        checkedPrefectures={prefectures.filter((pref) => pref.isChecked)}
      />
    </div>
  );
};

export default App;
