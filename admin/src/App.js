// AdminDashboardApp/src/App.js
import React from 'react';
// Assurez-vous que AdminDashboard.js est directement dans le dossier src/ de ce projet (AdminDashboardApp/src/)
import AdminDashboard from './AdminDashboard'; 

// Vous pouvez ajouter des styles globaux ici si nécessaire, ou laisser vide
// import './App.css'; 

function App() {
  return (
    <div className="App">
      {/* Le tableau de bord d'administration sera le seul contenu de cette application */}
      <AdminDashboard />
    </div>
  );
}

export default App;
