import { PageContext } from "vike/types"

export { data }
 
async function data(pageContext: PageContext) {
  const { place_id } = pageContext.urlParsed.search

  if (!place_id) {
    return;
  }
  
  const response = await fetch(
    `${import.meta.env.VITE_MEILISEARCH_URL!}/api/cafe/${place_id}`
  );


  if (!response.ok) {
    throw new Error("Failed to fetch cafe");
  }
 
  let cafeToSelect = await response.json()

  return {
    cafeToSelect
  }
}