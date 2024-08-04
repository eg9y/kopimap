import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
  appDescription: "Map of Cafes in DKI Jakarta",
  noReviews: "No Reviews",
  basedOnReviews: "Based on {count:number} review. ",
  ratingsBreakdown: "Ratings Breakdown",
  signOut: "Sign Out",
  signIn: "Sign in",
  loginToReview: "Login to Review",
  searchCafes: "Search...",
  categories: {
    Ambiance: "Ambiance",
    "Work-Friendly": "Work-Friendly",
    "Food & Drinks": "Food & Drinks",
    Value: "Value",
    Facilities: "Facilities",
    "Special Features": "Special Features"
  },
  attributes: {
    comfort_level: {
      name: "Comfort Level",
      options: {
        Minimal: "Minimal",
        Adequate: "Adequate",
        Comfortable: "Comfortable",
        Luxurious: "Luxurious"
      }
    },
    seating_capacity: {
      name: "Seating Capacity",
      options: {
        Limited: "Limited",
        Moderate: "Moderate",
        Spacious: "Spacious"
      }
    },
    wifi_quality: {
      name: "WiFi Quality",
      options: {
        "No WiFi": "No WiFi",
        Unreliable: "Unreliable",
        Decent: "Decent",
        "Fast and Reliable": "Fast and Reliable"
      }
    },
    outlet_availability: {
      name: "Outlet Availability",
      options: {
        "None Visible": "None Visible",
        Scarce: "Scarce",
        Adequate: "Adequate",
        Plentiful: "Plentiful"
      }
    },
    work_suitability: {
      name: "Work Suitability",
      options: {
        "Not Suitable": "Not Suitable",
        Tolerable: "Tolerable",
        Good: "Good",
        Excellent: "Excellent"
      }
    },
    coffee_quality: {
      name: "Coffee Quality",
      options: {
        Subpar: "Subpar",
        Average: "Average",
        Good: "Good",
        Excellent: "Excellent"
      }
    },
    non_coffee_options: {
      name: "Non-Coffee Options",
      options: {
        "Very Limited": "Very Limited",
        "Some Options": "Some Options",
        "Wide Variety": "Wide Variety"
      }
    },
    food_options: {
      name: "Food Options",
      options: {
        "No Food": "No Food",
        "Snacks Only": "Snacks Only",
        "Light Meals": "Light Meals",
        "Full Menu": "Full Menu"
      }
    },
    price_quality_ratio: {
      name: "Price-Quality Ratio",
      options: {
        Overpriced: "Overpriced",
        Fair: "Fair",
        "Good Value": "Good Value",
        "Excellent Value": "Excellent Value"
      }
    },
    parking_options: {
      name: "Parking Options",
      options: {
        "No Parking": "No Parking",
        "Limited Street Parking": "Limited Street Parking",
        "Adequate Parking": "Adequate Parking",
        "Ample Parking": "Ample Parking"
      }
    },
    cleanliness: {
      name: "Cleanliness",
      options: {
        "Needs Improvement": "Needs Improvement",
        Acceptable: "Acceptable",
        Clean: "Clean",
        Spotless: "Spotless"
      }
    },
    restroom_quality: {
      name: "Restroom Quality",
      options: {
        "No Restroom": "No Restroom",
        "Needs Improvement": "Needs Improvement",
        Acceptable: "Acceptable",
        Clean: "Clean",
        "Exceptionally Clean": "Exceptionally Clean"
      }
    },
    accessibility: {
      name: "Accessibility",
      options: {
        "Not Accessible": "Not Accessible",
        "Partially Accessible": "Partially Accessible",
        "Fully Accessible": "Fully Accessible"
      }
    },
    outdoor_seating: {
      name: "Outdoor Seating",
      options: {
        None: "None",
        Limited: "Limited",
        Ample: "Ample"
      }
    },
    instagram_worthiness: {
      name: "Instagram Worthiness",
      options: {
        "Not Particularly": "Not Particularly",
        "Somewhat Photogenic": "Somewhat Photogenic",
        "Very Instagrammable": "Very Instagrammable"
      }
    },
    pet_friendly: {
      name: "Pet-Friendly",
      options: {
        no: "No",
        yes: "Yes"
      }
    }
  },
  submitReview: {
    createReview: "Create Review",
    updateReview: "Update Review",
    imageUploadError: "Error uploading image",
    existingImages: "Existing images",
    newImagesToUpload: "New Images to Upload",
    newImage: "New Image",
    pleaseLogin: "Please login to create a review 🙏",
    login: "Login",
    userHaveReviewed: "You have reviewed this cafe",
    modifyingExisting: "You're modifying your existing review. Update the fields you'd like to change.",
    fillOptions: "Fill in the options you'd like to review. Only the overall rating is required.",
    overallRating: "Overall Rating",
    selectRating: "Select a rating",
    images: "Images",
    cancel: "Cancel",
    submit: "Submit Review",
    update: "Update Review",
    errorCorrection: "Please correct the following errors:",
    ratingRequired: "Overall rating is required",
    validationErrors: "Some fields have validation errors",
    unableToSubmit: "Unable to submit review",
    ensureLoginAndCafe: "Please ensure you're logged in and a cafe is selected.",
    reviewUpdated: "Review Updated",
    reviewSubmitted: "Review Submitted",
    updateSuccess: "Your review has been successfully updated.",
    submitSuccess: "Your review has been successfully submitted."
  },
  cafeDetails: {
    userReviews: "User Reviews",
    writeAReview: "Write a Review"
  },
  ratingLabels: {
    Bad: "Bad",
    Poor: "Poor",
    Average: "Average",
    Great: "Great",
    Excellent: "Excellent"
  }
}

export default en