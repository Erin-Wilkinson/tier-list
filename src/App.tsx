import React from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import TierList from './components/TierList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tier List Maker</h1>
      </header>
      
      <main className="App-main">
        <ImageUpload />
        <TierList />
      </main>
    </div>
  );
}

export default App;
