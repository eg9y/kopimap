import { Client } from "@googlemaps/google-maps-services-js";
import { createClient } from "@supabase/supabase-js";

import * as dotenv from "dotenv";

dotenv.config();

let delay = 1000; // Start with 1 second delay
const maxDelay = 16000; // Max delay of 16 seconds

const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";

if (
  !process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY === ""
) {
  throw new Error("The GOOGLE_PLACES_API_KEY environment variable is not set");
}

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === ""
) {
  throw new Error(
    "The NEXT_PUBLIC_SUPABASE_URL environment variable is not set",
  );
}

if (
  !process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_KEY === ""
) {
  throw new Error(
    "The SUPABASE_SERVICE_KEY environment variable is not set",
  );
}

const boundingBox = {
  top: -6.0904,
  bottom: -6.3942,
  left: 106.7140,
  right: 106.9724,
};

const client = new Client({});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || "",
);

const gridDimensions = { rows: 5, columns: 5 }; // Adjust as needed

let processedGrids = 0; // Counter to track the number of processed grids

let errorLog = [];

function logError(error: any, message: string) {
  console.error(`${message}:`, error.message);
  errorLog.push({ error, message });
}

function generateGrid(boundingBox: any, gridDimensions: any) {
  const latStep = (boundingBox.top - boundingBox.bottom) / gridDimensions.rows;
  const lngStep = (boundingBox.right - boundingBox.left) /
    gridDimensions.columns;
  const grid = [];

  for (let i = 0; i < gridDimensions.rows; i++) {
    for (let j = 0; j < gridDimensions.columns; j++) {
      const topLeft = {
        lat: boundingBox.top - (i * latStep),
        lng: boundingBox.left + (j * lngStep),
      };
      const bottomRight = {
        lat: topLeft.lat - latStep,
        lng: topLeft.lng + lngStep,
      };
      grid.push({ topLeft, bottomRight });
    }
  }

  return grid;
}

async function fetchCafesInSegment(segment: any, nextPageToken = "") {
  const centerLat = (segment.topLeft.lat + segment.bottomRight.lat) / 2;
  const centerLng = (segment.topLeft.lng + segment.bottomRight.lng) / 2;
  const radius = Math.sqrt(
    Math.pow(segment.topLeft.lat - segment.bottomRight.lat, 2) +
      Math.pow(segment.topLeft.lng - segment.bottomRight.lng, 2),
  ) / 2 * 111000; // Approximate conversion from degrees to meters

  console.log(
    `Fetching cafes in segment centered at ${centerLat}, ${centerLng} with radius ${radius} meters.`,
  );

  try {
    try {
      const response = await client.placesNearby({
        params: {
          location: { latitude: centerLat, longitude: centerLng },
          radius,
          type: "cafe",
          keyword: "Coffee Shop", // Add a keyword to refine the search
          key: apiKey,
          pagetoken: nextPageToken, // Use the next_page_token for pagination
        },
        timeout: 1000, // milliseconds
      });
      const cafes = response.data.results;
      console.log(`Fetched ${cafes.length} cafes in current segment.`);
      nextPageToken = response.data.next_page_token || ""; // Store the next_page_token

      // Get the place_ids from the cafes fetched in the current segment
      const placeIds = cafes.map((cafe) => cafe.place_id);

      // Check for existing entries in the database
      const { data: existingEntries, error } = await supabase
        .from("cafes")
        .select("place_id")
        .in("place_id", placeIds);

      if (error) {
        logError(error, `Error fetching existing cafes. place_id: ${placeIds}`);
        return;
      }

      // Create a set of existing place_ids for faster lookup
      const existingPlaceIds = new Set(
        existingEntries.map((entry) => entry.place_id),
      );

      // Filter out cafes that already exist in the database
      const newCafes = cafes.filter((cafe) =>
        !existingPlaceIds.has(cafe.place_id)
      );

      // New: array to hold the detailed data of cafes
      const detailedCafeData = [];

      for (const cafe of newCafes) {
        console.log(`${cafe.name}, ${cafe.vicinity}`);
        if (!cafe.geometry || !cafe.geometry.location) {
          console.warn(`No location data for cafe: ${cafe.name}`);
          continue; // Skip this cafe
        }

        if (!cafe.place_id) {
          console.warn(`No place_id for cafe: ${cafe.name}`);
          continue; // Skip this cafe
        }

        // New: fetch detailed info for each cafe
        const detailedData = await fetchCafeDetails(cafe.place_id);
        detailedCafeData.push({
          ...detailedData,
          name: cafe.name,
          place_id: cafe.place_id,
          location:
            `POINT(${cafe.geometry.location.lng} ${cafe.geometry.location.lat})`,
        });
      }

      // This replaces the prior snippet
      if (detailedCafeData.length > 0) {
        try {
          const { error } = await supabase
            .from("cafes")
            .insert(detailedCafeData);
          if (error) {
            console.error("Error inserting cafes:", error.message);
            throw error;
          }
        } catch (error: any) {
          console.error("Error inserting cafes:", error.message);
          throw error;
        }
      } else {
        console.warn("No cafes with location data to insert");
      }
    } catch (error: any) {
      logError(error, `Error fetching cafes in segment. segment: ${segment}`);
    }

    // If nextPageToken exists, it means there are more pages to fetch
    if (nextPageToken) {
      console.log(`Waiting for ${delay} ms before fetching the next page...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Double the delay for the next iteration (exponential backoff)
      delay *= 2;

      // If delay exceeds maxDelay, reset it back to initial delay
      if (delay > maxDelay) {
        console.log("Delay exceeded max delay, resetting...");
        delay = 2000; // Reset delay back to 1 second
      }

      // Recursively call fetchCafesInSegment with the new nextPageToken
      return fetchCafesInSegment(segment, nextPageToken);
    } else {
      // Reset delay for the next segment/grid
      delay = 2000;
    }

    return nextPageToken;
  } catch (error: any) {
    logError(error, `Error fetching cafes in segment. segment: ${segment}`);
  }
}

let checkOnce = false;
async function fetchCafeDetails(placeId: string) {
  try {
    const fields = [
      "curbside_pickup",
      "delivery",
      "dine_in",
      "editorial_summary",
      "price_level",
      "reservable",
      "reviews",
      "serves_beer",
      "serves_vegetarian_food",
      "serves_wine",
      "takeout",
      "address_components",
      "adr_address",
      "business_status",
      "formatted_address",
      "geometry",
      "icon",
      "icon_mask_base_uri",
      "icon_background_color",
      "name",
      "place_id",
      "type",
      "url",
      "vicinity",
      "wheelchair_accessible_entrance",
    ].join(",");

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=${fields}&reviews_no_translations=true`;

    const response = await fetch(url, { method: "GET" })
      .then((response) => response.json());

    const cafeDetails = response.result;

    if (!checkOnce) {
      console.log("cafeDetailz", cafeDetails);
      checkOnce = true;
    }

    // Map the fields to the payload for your database
    const payload = {
      curbside_pickup: cafeDetails.curbside_pickup,
      delivery: cafeDetails.delivery,
      dine_in: cafeDetails.dine_in,
      editorial_summary: cafeDetails.editorial_summary,
      price_level: cafeDetails.price_level,
      reservable: cafeDetails.reservable,
      reviews: cafeDetails.reviews,
      serves_beer: cafeDetails.serves_beer,
      serves_vegetarian_food: cafeDetails.serves_vegetarian_food,
      serves_wine: cafeDetails.serves_wine,
      takeout: cafeDetails.takeout,
      address_components: cafeDetails.address_components,
      adr_address: cafeDetails.adr_address,
      business_status: cafeDetails.business_status,
      formatted_address: cafeDetails.formatted_address,
      geometry: cafeDetails.geometry,
      icon: cafeDetails.icon,
      icon_mask_base_uri: cafeDetails.icon_mask_base_uri,
      icon_background_color: cafeDetails.icon_background_color,
      name: cafeDetails.name,
      place_id: cafeDetails.place_id,
      type: cafeDetails.type,
      url: cafeDetails.url,
      vicinity: cafeDetails.vicinity,
      wheelchair_accessible_entrance:
        cafeDetails.wheelchair_accessible_entrance,
    };

    return payload;
  } catch (error: any) {
    logError(error, `Error fetching cafe details. place_id: ${placeId}`);
    return null;
  }
}

async function fetchCafes() {
  const grid = generateGrid(boundingBox, gridDimensions);
  for (const segment of grid) {
    await fetchCafesInSegment(segment);
    console.log(
      `==========CURRENT GRID INDEX: ${processedGrids}==========`,
    );
    processedGrids++;
  }

  if (errorLog.length > 0) {
    console.error(`${errorLog.length} errors occurred during processing`);
    // Further processing of errors, e.g., sending a report
  }
}

async function populateMoreDetails() {
  // iterate through all photos field in cafes in iterations of 100
  // photos is a text array
  // for each entry in photos, fetch the photo from the url. store this in an array. Then update the cafe entry by inserting the array of photos into photo_urls text array field
  // if there is an error, log it and the cafe entry
  let batch = 0;
  let batchSize = 100;
  let offset = 0;
  let cafesWithErrors = [];

  while (true) {
    const { data: cafes, error } = await supabase
      .from("cafes")
      .select("place_id, photos")
      .order("place_id", { ascending: true })
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error("Error fetching cafes:", error.message);
      throw error;
    }

    if (cafes.length === 0) {
      break;
    }

    for (const cafe of cafes) {
      const cafeDetails = await fetchCafeDetails(cafe.place_id);

      if (!cafeDetails) {
        cafesWithErrors.push(cafe);
        console.log(`Errors: ${JSON.stringify(cafesWithErrors, null, 2)}`);
        throw new Error(
          `Error fetching cafe details. place_id: ${cafe.place_id}`,
        );
      }

      const { reviews, ...cafeDetailsWithoutReviews } = cafeDetails;
      try {
        // get create new variable with all cafeDetails except for reviews
        const { error } = await supabase
          .from("cafes")
          .update({ ...cafeDetailsWithoutReviews })
          .match({ place_id: cafe.place_id });

        if (error) {
          console.error("Error updating cafes:", error.message);
          throw error;
        }
      } catch (error: any) {
        console.error("Error updating cafes:", error.message);
        cafesWithErrors.push(cafe);
      }

      if (!reviews) {
        continue;
      }

      const reviewData = reviews.map((review: any) => {
        return {
          place_id: cafe.place_id,
          author_name: review.author_name,
          author_url: review.author_url,
          language: review.language,
          profile_photo_url: review.profile_photo_url,
          rating: review.rating,
          relative_time_description: review.relative_time_description,
          text: review.text,
          time: review.time,
        };
      });

      try {
        const { error } = await supabase
          .from("reviews")
          .insert(reviewData);

        if (error) {
          console.error("Error inserting reviews:", error.message);
          throw error;
        }
      } catch (error: any) {
        console.error("Error inserting reviews:", error.message);
        cafesWithErrors.push(cafe);
      }
    }

    batch++;
    offset = batch * batchSize;
    console.log(`Processed batch ${batch}`);
  }
}

populateMoreDetails();

// Call the function
// fetchCafes();

// populatePhotos();

// async function populatePhotos() {
//   // iterate through all photos field in cafes in iterations of 100
//   // photos is a text array
//   // for each entry in photos, fetch the photo from the url. store this in an array. Then update the cafe entry by inserting the array of photos into photo_urls text array field
//   // if there is an error, log it and the cafe entry
//   let batch = 0;
//   let batchSize = 100;
//   let offset = 0;
//   let cafesWithErrors = [];

//   while (true) {
//     const { data: cafes, error } = await supabase
//       .from("cafes")
//       .select("place_id, photos")
//       .order("place_id", { ascending: true })
//       .range(offset, offset + batchSize - 1);

//     if (error) {
//       console.error("Error fetching cafes:", error.message);
//       throw error;
//     }

//     if (cafes.length === 0) {
//       break;
//     }

//     for (const cafe of cafes) {
//       const photoUrls = [];
//       for (const photo of cafe.photos) {
//         try {
//           const response = await fetch(photo, {
//             method: "GET",
//             redirect: "manual", // This prevents the actual redirect and allows us to inspect the location header
//           });

//           const imageUrl = response.headers.get("location");
//           photoUrls.push(imageUrl);
//         } catch (error: any) {
//           console.error("Error fetching photo:", error.message);
//           cafesWithErrors.push(cafe);
//         }
//       }

//       try {
//         const { error } = await supabase
//           .from("cafes")
//           .update({ photo_urls: photoUrls })
//           .match({ place_id: cafe.place_id });

//         if (error) {
//           console.error("Error updating cafes:", error.message);
//           throw error;
//         }
//       } catch (error: any) {
//         console.error("Error updating cafes:", error.message);
//         cafesWithErrors.push(cafe);
//       }
//     }

//     batch++;
//     offset = batch * batchSize;
//     console.log(`Processed batch ${batch}`);
//   }
// }
