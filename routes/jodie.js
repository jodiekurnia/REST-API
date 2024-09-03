const express = require("express");
const jodieModel = require("../models/jodieModel");
// const priceModel = require("../models/priceModel");
const router = express.Router();

// Get list of accounts with status 'fresh' and update their status to 'used'
router.get("/get/:amount", async (req, res) => {
  const { amount } = req.params;

  try {
    const amountNumber = parseInt(amount);

    // Mengambil data dari database dengan status 'fresh' dan limit sesuai parameter amount
    const data = await jodieModel.find({ status: "fresh" }).limit(amountNumber);

    // Memeriksa apakah jumlah data yang ditemukan sesuai dengan jumlah yang diminta
    if (data.length < amountNumber) {
      return res.status(400).json({
        status: "error",
        message: `Less than ${amountNumber} entries found.`,
      });
    }

    // Memperbarui status data yang diambil menjadi 'used'
    await jodieModel.updateMany(
      { _id: { $in: data.map((entry) => entry._id) } },
      { $set: { status: "used" } }
    );

    // Memetakan data untuk hanya menyertakan email dan password
    const filteredData = data.map((entry) => ({
      email: entry.email,
      password: entry.password,
    }));

    res.status(200).json({ status: "success", data: filteredData });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Endpoint untuk menambah akun, baik secara individu maupun batch
router.post("/add", async (req, res) => {
  try {
    let accounts = req.body;

    // Jika data bukan array, ubah menjadi array
    if (!Array.isArray(accounts)) {
      accounts = [accounts];
    }

    // Validasi data
    if (accounts.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No account data provided." });
    }

    // Mengecek duplikasi email dalam array dan buat set unik
    const emailSet = new Set();
    const duplicateEmailsInArray = new Set();
    const uniqueAccounts = [];

    accounts.forEach((account) => {
      if (emailSet.has(account.email)) {
        duplicateEmailsInArray.add(account.email);
      } else {
        emailSet.add(account.email);
        uniqueAccounts.push(account);
      }
    });

    // Ambil daftar email dari data yang dikirim
    const emailList = uniqueAccounts.map((account) => account.email);

    // Cari email yang sudah ada di database
    const existingEmails = await jodieModel
      .find({ email: { $in: emailList } })
      .select("email");

    // Buat set dari email yang sudah ada
    const existingEmailSet = new Set(
      existingEmails.map((emailDoc) => emailDoc.email)
    );

    // Pisahkan data yang belum ada di database
    const newAccounts = uniqueAccounts.filter(
      (account) => !existingEmailSet.has(account.email)
    );
    const existingAccounts = uniqueAccounts.filter((account) =>
      existingEmailSet.has(account.email)
    );

    // Simpan data yang baru ke database
    let result = [];
    if (newAccounts.length > 0) {
      result = await jodieModel.insertMany(newAccounts);
    }

    // Siapkan respons dengan informasi tentang data yang berhasil ditambahkan dan duplikasi
    const response = {
      status: "success",
      message: `Added ${newAccounts.length} new accounts.`,
      data: result,
    };

    // Tambahkan informasi tentang duplikasi dalam array
    if (duplicateEmailsInArray.size > 0) {
      response.message += ` There were ${duplicateEmailsInArray.size} duplicate email addresses in the input data.`;
      response.duplicateEmails = Array.from(duplicateEmailsInArray);
    }

    // Tambahkan informasi tentang email yang sudah ada di database
    if (existingAccounts.length > 0) {
      response.message += ` Some email addresses already exist in the database.`;
      response.existingAccounts = existingAccounts;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// // Combo EndPoint
// router.post("/combo", async (req, res) => {
//   try {
//     let combo = req.body;

//     // Jika data bukan array, ubah menjadi array
//     if (!Array.isArray(combo)) {
//       combo = [combo];
//     }

//     // Validasi data
//     if (combo.length === 0) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "No data provided." });
//     }

//     // Query the database for each price in the combo array
//     const urls = await Promise.all(
//       combo.map(async (price) => {
//         const result = await priceModel.findOne({ price });
//         return result ? result.url : null;
//       })
//     );

//     // Remove null values from the results
//     const filteredUrls = urls.filter((url) => url !== null);

//     // Check if there are any URLs found
//     if (filteredUrls.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "No URLs found for the provided prices.",
//       });
//     }

//     // Respond with the found URLs
//     res.json({ status: "success", urls: filteredUrls });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// // Add Combo EndPoint
// router.post("/combo/add", async (req, res) => {
//   try {
//     const data = req.body;

//     // Validasi data
//     if (!Array.isArray(data) || data.length === 0) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "No valid data provided." });
//     }

//     // Insert data into the database
//     await priceModel.insertMany(data);

//     res.json({ status: "success", message: "Data added successfully." });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// Endpoint baru untuk menghapus semua data dalam jodieModel
router.get("/deleteall", async (req, res) => {
  try {
    await jodieModel.deleteMany({});
    res
      .status(200)
      .json({ status: "success", message: "All records deleted." });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Report EndPoint
router.get("/report", async (req, res) => {
  try {
    // Hitung jumlah email dengan status 'fresh'
    const freshCount = await jodieModel.countDocuments({ status: "fresh" });

    // Hitung jumlah email dengan status 'used'
    const usedCount = await jodieModel.countDocuments({ status: "used" });

    // Mengirimkan laporan sebagai respons
    res.status(200).json({
      status: "success",
      report: {
        fresh: freshCount,
        used: usedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
