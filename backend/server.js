const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const moment = require('moment-timezone');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.post('/api/redeem-voucher', async (req, res) => {
  let { voucherCode } = req.body;
  voucherCode = voucherCode.toLowerCase(); // Convert to lowercase

  try {
    console.log('Attempting to redeem voucher:', voucherCode);

    const voucherQuery = 'SELECT * FROM vouchers WHERE LOWER(code) = $1';
    const voucherResult = await pool.query(voucherQuery, [voucherCode]);

    if (voucherResult.rows.length === 0) {
      console.log('Voucher not found, creating a new one');

      const createdAt = moment().tz('Asia/Dubai').format();
      const insertQuery = 'INSERT INTO vouchers (code, created_at, redeemed_at) VALUES ($1, $2, $3) RETURNING *';
      const insertResult = await pool.query(insertQuery, [voucherCode, createdAt, createdAt]);

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
      const formattedRedeemedAt = moment(voucher.redeemed_at).tz('Asia/Dubai').format('MMMM Do YYYY, h:mm:ss a');
      return res.status(400).json({
        success: false,
        message: 'Voucher has already been redeemed.',
        redeemedAt: formattedRedeemedAt,
      });
    }

    const redeemedAt = moment().tz('Asia/Dubai').format();

    const updateQuery = 'UPDATE vouchers SET redeemed_at = $1 WHERE LOWER(code) = $2';
    await pool.query(updateQuery, [redeemedAt, voucherCode]);

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('PostgreSQL Database URL:', process.env.DATABASE_URL ? '******' : 'Not set');
});