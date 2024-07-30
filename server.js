const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/redeem-voucher', async (req, res) => {
  const { voucherCode } = req.body;

  try {
    // Check if voucher exists and is not redeemed
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
        redeemedAt: new Date(data.redeemed_at).toLocaleString(),
      });
    }

    // Redeem the voucher
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});