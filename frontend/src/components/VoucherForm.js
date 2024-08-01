import React, { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoucherForm = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/redeem-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voucherCode }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        message: 'An error occurred while processing the voucher.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="form-inline">
        <div className="form-group mb-2">
          <input
            type="text"
            className="form-control"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Enter voucher code"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mb-2" disabled={isLoading}>
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Redeem Voucher'
          )}
        </button>
      </form>
      {result && (
        <div className="mt-3">
          <p className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>
            {result.message}
          </p>
          {result.redeemedAt && <p>Redeemed at: {result.redeemedAt}</p>}
        </div>
      )}
    </div>
  );
};

export default VoucherForm;