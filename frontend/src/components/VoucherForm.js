import React, { useState } from 'react';

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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Enter voucher code"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Redeeming...' : 'Redeem Voucher'}
        </button>
      </form>
      {result && (
        <div>
          <p>{result.message}</p>
          {result.redeemedAt && <p>Redeemed at: {result.redeemedAt}</p>}
        </div>
      )}
    </div>
  );
};

export default VoucherForm;