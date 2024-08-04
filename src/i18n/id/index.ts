import type { Translation } from '../i18n-types'

const id: Translation = {
  appDescription: "Peta Cafe di DKI Jakarta",
  noReviews: "Belum Ada Ulasan",
  basedOnReviews: "Berdasarkan {count} ulasan. ",
  ratingsBreakdown: "Ulasan",
  signOut: "Sign Out",
  signIn: "Sign in",
  loginToReview: "Login untuk buat ulasan",
  searchCafes: "Cari...",
  categories: {
    Ambiance: "Suasana",
    "Work-Friendly": "Ramah untuk Bekerja",
    "Food & Drinks": "Makanan & Minuman",
    Value: "Harga",
    Facilities: "Fasilitas",
    "Special Features": "Fitur Khusus"
  },
  attributes: {
    comfort_level: {
      name: "Tingkat Kenyamanan",
      options: {
        Minimal: "Minimal",
        Adequate: "Memadai",
        Comfortable: "Nyaman",
        Luxurious: "Mewah"
      }
    },
    seating_capacity: {
      name: "Kapasitas Tempat Duduk",
      options: {
        Limited: "Terbatas",
        Moderate: "Sedang",
        Spacious: "Luas"
      }
    },
    wifi_quality: {
      name: "Kualitas WiFi",
      options: {
        "No WiFi": "Tidak Ada WiFi",
        Unreliable: "Tidak Stabil",
        Decent: "Cukup Baik",
        "Fast and Reliable": "Cepat dan Stabil"
      }
    },
    outlet_availability: {
      name: "Ketersediaan Stop Kontak",
      options: {
        "None Visible": "Tidak Terlihat",
        Scarce: "Langka",
        Adequate: "Memadai",
        Plentiful: "Berlimpah"
      }
    },
    work_suitability: {
      name: "Kesesuaian untuk Bekerja",
      options: {
        "Not Suitable": "Tidak Sesuai",
        Tolerable: "Bisa Ditoleransi",
        Good: "Baik",
        Excellent: "Sangat Baik"
      }
    },
    coffee_quality: {
      name: "Kualitas Kopi",
      options: {
        Subpar: "Di Bawah Standar",
        Average: "Rata-rata",
        Good: "Baik",
        Excellent: "Sangat Baik"
      }
    },
    non_coffee_options: {
      name: "Pilihan Non-Kopi",
      options: {
        "Very Limited": "Sangat Terbatas",
        "Some Options": "Beberapa Pilihan",
        "Wide Variety": "Banyak Pilihan"
      }
    },
    food_options: {
      name: "Pilihan Makanan",
      options: {
        "No Food": "Tidak Ada Makanan",
        "Snacks Only": "Hanya Cemilan",
        "Light Meals": "Makanan Ringan",
        "Full Menu": "Menu Lengkap"
      }
    },
    price_quality_ratio: {
      name: "Rasio Harga-Kualitas",
      options: {
        Overpriced: "Terlalu Mahal",
        Fair: "Wajar",
        "Good Value": "Nilai Bagus",
        "Excellent Value": "Nilai Sangat Bagus"
      }
    },
    parking_options: {
      name: "Pilihan Parkir",
      options: {
        "No Parking": "Tidak Ada Parkir",
        "Limited Street Parking": "Parkir Jalan Terbatas",
        "Adequate Parking": "Parkir Memadai",
        "Ample Parking": "Parkir Luas"
      }
    },
    cleanliness: {
      name: "Kebersihan",
      options: {
        "Needs Improvement": "Perlu Perbaikan",
        Acceptable: "Bisa Diterima",
        Clean: "Bersih",
        Spotless: "Sangat Bersih"
      }
    },
    restroom_quality: {
      name: "Kualitas Toilet",
      options: {
        "No Restroom": "Tidak Ada Toilet",
        "Needs Improvement": "Perlu Perbaikan",
        Acceptable: "Bisa Diterima",
        Clean: "Bersih",
        "Exceptionally Clean": "Sangat Bersih"
      }
    },
    accessibility: {
      name: "Akses Untuk Difabilitas",
      options: {
        "Not Accessible": "Tidak Dapat Diakses",
        "Partially Accessible": "Sebagian Dapat Diakses",
        "Fully Accessible": "Sepenuhnya Dapat Diakses"
      }
    },
    outdoor_seating: {
      name: "Tempat Duduk Luar Ruangan",
      options: {
        None: "Tidak Ada",
        Limited: "Terbatas",
        Ample: "Banyak"
      }
    },
    instagram_worthiness: {
      name: "Nilai Instagramable",
      options: {
        "Not Particularly": "Tidak Terlalu",
        "Somewhat Photogenic": "Cukup Fotogenik",
        "Very Instagrammable": "Sangat Instagramable"
      }
    },
    pet_friendly: {
      name: "Ramah Hewan Peliharaan",
      options: {
        no: "Tidak",
        yes: "Ya"
      }
    }
  },
  submitReview: {
    createReview: "Buat Ulasan",
    updateReview: "Perbarui Ulasan",
    imageUploadError: "Error pas upload gambar", 
    existingImages: "Gambar yang telah di-upload",
    newImagesToUpload: "Gambar baru untuk di-upload",
    newImage: "Gambar baru",
    pleaseLogin: "Silakan masuk untuk membuat ulasan 🙏",
    login: "Masuk",
  userHaveReviewed: "Anda sudah mengulas kafe ini",
    modifyingExisting: "Anda sedang mengubah ulasan yang ada. Perbarui bidang yang ingin Anda ubah.",
    fillOptions: "Isi opsi yang ingin Anda ulas. Hanya peringkat keseluruhan yang wajib diisi.",
    overallRating: "Peringkat Keseluruhan",
    selectRating: "Pilih peringkat",
    images: "Gambar",
    cancel: "Batal",
    submit: "Kirim Ulasan",
    update: "Perbarui Ulasan",
    errorCorrection: "Harap perbaiki kesalahan berikut:",
    ratingRequired: "Peringkat keseluruhan wajib diisi",
    validationErrors: "Beberapa bidang memiliki kesalahan validasi",
    unableToSubmit: "Tidak dapat mengirim ulasan",
    ensureLoginAndCafe: "Pastikan Anda sudah masuk dan kafe telah dipilih.",
    reviewUpdated: "Ulasan Diperbarui",
    reviewSubmitted: "Ulasan Dikirim",
    updateSuccess: "Ulasan Anda telah berhasil diperbarui.",
    submitSuccess: "Ulasan Anda telah berhasil dikirim."
  },
  cafeDetails: {
    userReviews: "Ulasan",
    writeAReview: "Tulis ulasan"
  },
  ratingLabels: {
    Bad: "Buruk",
    Poor: "Kurang",
    Average: "Rata-rata",
    Great: "Bagus",
    Excellent: "Sangat Bagus"
  }
}

export default id