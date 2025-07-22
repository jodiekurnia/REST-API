const express = require('express');
const Tevi = require('../models/teviModel');
const router = express.Router();

// Mendapatkan data phone beserta semua cloner
router.get('/:phone', async (req, res) => {
  try {
    const data = await Tevi.findOne({ phone: req.params.phone });
    if (!data) return res.status(404).json({ message: 'Phone tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mendapatkan data cloner tertentu dari phone
router.get('/:phone/:cloner', async (req, res) => {
  try {
    const phone = req.params.phone;
    const clonerNumber = parseInt(req.params.cloner);
    const data = await Tevi.findOne({ phone });
    if (!data) return res.status(404).json({ message: 'Phone tidak ditemukan' });
    const cloner = data.cloners.find(c => c.clonerNumber === clonerNumber);
    if (!cloner) return res.status(404).json({ message: 'Cloner tidak ditemukan' });
    res.json(cloner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Menambah satu akun gmail ke cloner tertentu
router.post('/:phone/:cloner', async (req, res) => {
  try {
    const phone = req.params.phone;
    const clonerNumber = parseInt(req.params.cloner);
    const gmail = req.body; // satu akun gmail
    // Validasi sederhana
    if (!gmail || !gmail.firstName || !gmail.lastName || !gmail.email || !gmail.password || !gmail.dob || !gmail.dob.month || !gmail.dob.date || !gmail.dob.year) {
      return res.status(400).json({ message: 'Data gmail tidak lengkap' });
    }
    let tevi = await Tevi.findOne({ phone });
    // Cek email sudah ada di cloner manapun pada phone ini
    if (tevi) {
      let foundCloner = null;
      tevi.cloners.forEach(cloner => {
        if (cloner.gmails.some(g => g.email.toLowerCase() === gmail.email.toLowerCase())) {
          foundCloner = cloner.clonerNumber;
        }
      });
      if (foundCloner !== null) {
        return res.status(400).json({ message: `Email sudah terdaftar di phone ${phone} pada cloner ${foundCloner}` });
      }
    }
    if (!tevi) {
      // Buat baru jika phone belum ada
      tevi = new Tevi({ phone, cloners: [{ clonerNumber, gmails: [gmail] }] });
    } else {
      // Cari cloner
      let cloner = tevi.cloners.find(c => c.clonerNumber === clonerNumber);
      if (!cloner) {
        if (tevi.cloners.length >= 50) {
          return res.status(400).json({ message: 'Maksimal 50 cloner per phone' });
        }
        tevi.cloners.push({ clonerNumber, gmails: [gmail] });
      } else {
        if (cloner.gmails.length >= 10) {
          return res.status(400).json({ message: 'Maksimal 10 akun gmail per cloner' });
        }
        cloner.gmails.push(gmail);
      }
    }
    await tevi.save();
    res.json(tevi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk menambah phone baru tanpa cloner
router.post('/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    // Cek jika phone sudah ada
    const existing = await Tevi.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Phone sudah terdaftar' });
    const tevi = new Tevi({ phone, cloners: [] });
    await tevi.save();
    res.status(201).json(tevi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Menghapus cloner tertentu dari phone
router.delete('/:phone/:cloner', async (req, res) => {
  try {
    const phone = req.params.phone;
    const clonerNumber = parseInt(req.params.cloner);
    const tevi = await Tevi.findOne({ phone });
    if (!tevi) return res.status(404).json({ message: 'Phone tidak ditemukan' });
    tevi.cloners = tevi.cloners.filter(c => c.clonerNumber !== clonerNumber);
    await tevi.save();
    res.json({ message: 'Cloner dihapus', tevi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 