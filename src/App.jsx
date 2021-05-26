import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from './components/Header';

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
        prefs[12].isChecked = true;
        setPrefectures(prefs);
      }
    })();
  }, []);

  return (
    <div className="App">
      <Header title="Title" />
    </div>
  );
};

export default App;
