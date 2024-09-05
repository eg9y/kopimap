import type { BaseTranslation } from "../i18n-types";

const en: BaseTranslation = {
  app: {
    title: "Kopimap - Discover Jakarta's Best Cafes 🗺️☕️",
    description:
      "Explore Jakarta's vibrant cafe scene with Kopimap. Find the perfect spot for coffee, work, or relaxation with our interactive map and detailed reviews.",
    shortDescription: "Cafe terdekat di DKI Jakarta",
    keywords: "Jakarta cafes, coffee shops, workspace, kopimap, cafe finder",
    ogTitle: "Kopimap - Jakarta's Ultimate Cafe Guide",
    ogDescription:
      "Discover the best cafes in Jakarta for coffee, work, and relaxation. Interactive map and detailed reviews.",
  },
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
    "Special Features": "Special Features",
  },
  attributes: {
    has_musholla: {
      name: "Has Musholla",
      options: {
        Yes: "Yes",
        No: "No",
      },
    },
    comfort_level: {
      name: "Comfort Level",
      options: {
        Minimal: "Minimal",
        Adequate: "Adequate",
        Comfortable: "Comfortable",
        Luxurious: "Luxurious",
      },
    },
    seating_capacity: {
      name: "Seating Capacity",
      options: {
        Limited: "Limited",
        Moderate: "Moderate",
        Spacious: "Spacious",
      },
    },
    wifi_quality: {
      name: "WiFi Quality",
      options: {
        "No WiFi": "No WiFi",
        Unreliable: "Unreliable",
        Decent: "Decent",
        "Fast and Reliable": "Fast and Reliable",
      },
    },
    outlet_availability: {
      name: "Outlet Availability",
      options: {
        "None Visible": "None Visible",
        Scarce: "Scarce",
        Adequate: "Adequate",
        Plentiful: "Plentiful",
      },
    },
    work_suitability: {
      name: "Work Suitability",
      options: {
        "Not Suitable": "Not Suitable",
        Tolerable: "Tolerable",
        Good: "Good",
        Excellent: "Excellent",
      },
    },
    coffee_quality: {
      name: "Coffee Quality",
      options: {
        Subpar: "Subpar",
        Average: "Average",
        Good: "Good",
        Excellent: "Excellent",
      },
    },
    non_coffee_options: {
      name: "Non-Coffee Options",
      options: {
        Subpar: "Subpar",
        Average: "Average",
        Good: "Good",
        Excellent: "Excellent",
      },
    },
    food_options: {
      name: "Food Options",
      options: {
        Subpar: "Subpar",
        Average: "Average",
        Good: "Good",
        Excellent: "Excellent",
      },
    },
    price_quality_ratio: {
      name: "Price-Quality Ratio",
      options: {
        Overpriced: "Overpriced",
        Fair: "Fair",
        "Good Value": "Good Value",
        "Excellent Value": "Excellent Value",
      },
    },
    parking_options: {
      name: "Parking Options",
      options: {
        "No Parking": "No Parking",
        "Limited Street Parking": "Limited Street Parking",
        "Adequate Parking": "Adequate Parking",
        "Ample Parking": "Ample Parking",
      },
    },
    cleanliness: {
      name: "Cleanliness",
      options: {
        "Needs Improvement": "Needs Improvement",
        Acceptable: "Acceptable",
        Clean: "Clean",
        Spotless: "Spotless",
      },
    },
    restroom_quality: {
      name: "Restroom Quality",
      options: {
        "No Restroom": "No Restroom",
        "Needs Improvement": "Needs Improvement",
        Acceptable: "Acceptable",
        Clean: "Clean",
        "Exceptionally Clean": "Exceptionally Clean",
      },
    },
    accessibility: {
      name: "Accessibility",
      options: {
        "Not Accessible": "Not Accessible",
        "Partially Accessible": "Partially Accessible",
        "Fully Accessible": "Fully Accessible",
      },
    },
    outdoor_seating: {
      name: "Outdoor Seating",
      options: {
        None: "None",
        Limited: "Limited",
        Ample: "Ample",
      },
    },
    instagram_worthiness: {
      name: "Instagram Worthiness",
      options: {
        "Not Particularly": "Not Particularly",
        "Somewhat Photogenic": "Somewhat Photogenic",
        "Very Instagrammable": "Very Instagrammable",
      },
    },
    pet_friendly: {
      name: "Pet-Friendly",
      options: {
        no: "No",
        yes: "Yes",
      },
    },
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
    modifyingExisting:
      "You're modifying your existing review. Update the fields you'd like to change.",
    fillOptions:
      "Fill in the options you'd like to review. Only the overall rating is required.",
    overallRating: "Overall Rating",
    selectRating: "Select a rating",
    images: "Images",
    cancel: "Cancel",
    submit: "Submit Review",
    update: "Update Review",
    errorCorrection: "Please correct the following errors:",
    ratingRequired: "Overall rating is required",
    unableToSubmit: "Unable to submit review",
    ensureLoginAndCafe:
      "Please ensure you're logged in and a cafe is selected.",
    reviewUpdated: "Review Updated",
    reviewSubmitted: "Review Submitted",
    updateSuccess: "Your review has been successfully updated.",
    submitSuccess: "Your review has been successfully submitted.",
    reviewText: "Review Text",
    reviewTextPlaceholder: "Share your thoughts about this cafe (optional)",
    reviewTextTooLong: "Review text must be 280 characters or less",
  },
  cafeDetails: {
    userReviews: "User Reviews",
    writeAReview: "Write a Review",
  },
  ratingLabels: {
    Bad: "Bad",
    Poor: "Poor",
    Average: "Average",
    Great: "Great",
    Excellent: "Excellent",
  },
  welcomeModal: {
    title: "Welcome to Kopimap! ☕️🗺️",
    description:
      "Your gateway to Jakarta's hidden coffee gems and cozy workspaces.",
    features: [
      "Explore an interactive map of Jakarta's vibrant cafe scene",
      "Discover cafes through honest, detailed community reviews",
      "Find your perfect spot with customizable filters",
      "Share your cafe experiences and help fellow coffee lovers",
      "Uncover nearby cafes for spontaneous coffee runs",
    ],
    passionProject:
      "Kopimap is a labor of love, crafted by a single developer with a passion for connecting people through great coffee experiences.",
    personalNote:
      "As the sole creator behind Kopimap, I pour my heart into this project every day. Your support means the world to me!",
    thankYou:
      "Thank you for joining me on this caffeinated journey across Jakarta!",
    closeButton: "Start Your Coffee Adventure",
  },
};

export default en;
