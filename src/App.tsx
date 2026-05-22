import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './features/journal/pages/HomePage';
import { NewEntryPage } from './features/journal/pages/NewEntryPage';
import { EntryDetailPage } from './features/journal/pages/EntryDetailPage';
import { MaskOffPage } from './features/maskoff/pages/MaskOffPage';
import { MaskOffDetailPage } from './features/maskoff/pages/MaskOffDetailPage';
import { NewMaskOffPage } from './features/maskoff/pages/NewMaskOffPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/new" element={
          <Layout>
            <NewEntryPage />
          </Layout>
        } />
        <Route path="/entry/:id" element={
          <Layout>
            <EntryDetailPage />
          </Layout>
        } />
        <Route path="/maskoff" element={
          <Layout>
            <MaskOffPage />
          </Layout>
        } />
        <Route path="/maskoff-detail/:id" element={
          <Layout>
            <MaskOffDetailPage />
          </Layout>
        } />
        <Route path="/new-maskoff" element={
          <Layout>
            <NewMaskOffPage />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;