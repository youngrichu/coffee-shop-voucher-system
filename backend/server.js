const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.post('/api/redeem-voucher', async (req, res) => {
  const { voucherCode } = req.body;

  try {
    console.log('Attempting to redeem voucher:', voucherCode);

    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', voucherCode)
      .single();

    if (error) {
      console.error('Error fetching voucher:', error);
      throw error;
    }

    console.log('Fetched voucher data:', data);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Voucher not found.' });
    }

    if (data.redeemed_at) {
      return res.status(400).json({
        success: false,
        message: 'Voucher has already been redeemed.',
        redeemedAt: data.redeemed_at,
      });
    }

    const { error: updateError } = await supabase
      .from('vouchers')
      .update({ redeemed_at: new Date().toISOString() })
      .eq('code', voucherCode);

    if (updateError) {
      console.error('Error updating voucher:', updateError);
      throw updateError;
    }

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
      error: error.message
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
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY ? '******' : 'Not set');
});