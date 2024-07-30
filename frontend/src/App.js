import React from 'react';
import VoucherForm from './components/VoucherForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Coffee Shop Voucher Redemption</h1>
      </header>
      <main>
        <VoucherForm />
      </main>
      <footer>
        <p>© 2023 Coffee Shop Voucher System</p>
      </footer>
    </div>
  );
}

export default App;