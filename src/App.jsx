import axios from 'axios';
import { useEffect } from 'react';
import Header from './components/Header';

const App = () => {
  const baseURL = 'https://opendata.resas-portal.go.jp';

  useEffect(() => {
    const fetchPrefectures = async () => {
      const response = await axios.get(`${baseURL}/api/v1/prefectures`, {
        headers: { 'X-API-KEY': process.env.REACT_APP_API_KEY },
      });

      return response;
    };
  }, []);

  return (
    <div className="App">
      <Header title="Title" />
    </div>
  );
};

export default App;
