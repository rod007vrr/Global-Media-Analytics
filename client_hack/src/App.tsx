import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './assets/theme';
import NotFoundPage from './NotFound/NotFoundPage';
import HomePage from './Home/HomePage';
import SongsPage from './Songs/SongsPage';
import ArtistsPage from './Artists/ArtistsPage';

import MapPage from './Map/MapPage';
import SimilarityPage from './Summary/SummaryPage';
import NavBar from './components/navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/similarity" element={<SimilarityPage />} />
              <Route path="/songs" element={<SongsPage />} />
              <Route path="/artists" element={<ArtistsPage />} />

              {/* Route which is accessed if no other route is matched */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CssBaseline>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
