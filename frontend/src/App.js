import React from 'react';
import VoucherForm from './components/VoucherForm';
import logo from './assets/coffee-logo.png'; // Add a coffee shop logo
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Coffee Shop Logo" className="logo" />
        <h1>Kaldi's Coffee Voucher Redemption</h1>
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