import React from 'react';
import VoucherForm from './components/VoucherForm';
import logo from './assets/kaldis-logo.png'; // Make sure this path is correct
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src={logo} alt="Kaldi's Coffee Logo" className="logo" />
          <h1>Kaldi's Coffee</h1>
          <h2>Voucher Redemption</h2>
        </div>
      </header>
      <main>
        <VoucherForm />
      </main>
      <footer>
        <p>© 2024 Kaldi's Coffee | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a></p>
      </footer>
    </div>
  );
}

export default App;