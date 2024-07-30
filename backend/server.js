const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.post('/api/redeem-voucher', async (req, res) => {
  const { voucherCode } = req.body;

  try {
    console.log('Attempting to redeem voucher:', voucherCode);

    // Query to fetch the voucher
    const voucherQuery = 'SELECT * FROM vouchers WHERE code = $1';
    const voucherResult = await pool.query(voucherQuery, [voucherCode]);

    if (voucherResult.rows.length === 0) {
      console.log('Voucher not found, creating a new one');

      const insertQuery = 'INSERT INTO vouchers (code, redeemed_at) VALUES ($1, $2) RETURNING *';
      const insertResult = await pool.query(insertQuery, [voucherCode, new Date().toISOString()]);

      const newVoucher = insertResult.rows[0];

      console.log('New voucher created and redeemed:', newVoucher);

      return res.json({
        success: true,
        message: 'Voucher created and redeemed successfully! Customer gets a free coffee.',
      });
    }

    const voucher = voucherResult.rows[0];

    console.log('Fetched voucher data:', voucher);

    if (voucher.redeemed_at) {
      return res.status(400).json({
        success: false,
        message: 'Voucher has already been redeemed.',
        redeemedAt: voucher.redeemed_at,
      });
    }

    // Query to update the voucher
    const updateQuery = 'UPDATE vouchers SET redeemed_at = $1 WHERE code = $2';
    await pool.query(updateQuery, [new Date().toISOString(), voucherCode]);

    console.log('Voucher redeemed successfully');

    res.json({
      success: true,
      message: 'Voucher redeemed successfully! Customer gets a free coffee.',
    });
  } catch (error) {
    console.error('Error processing voucher:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the voucher.',
      error: error.message,
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('PostgreSQL Database URL:', process.env.DATABASE_URL ? '******' : 'Not set');
});
