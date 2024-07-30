const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.post('/api/redeem-voucher', async (req, res) => {
  const { voucherCode } = req.body;

  try {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', voucherCode)
      .single();

    if (error) throw error;

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

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Voucher redeemed successfully! Customer gets a free coffee.',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the voucher.',
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
});