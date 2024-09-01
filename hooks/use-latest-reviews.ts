import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const useLatestReviews = (limit = 10) => {
  return useQuery({
    queryKey: ['latestReviews', limit],
    queryFn: () => fetchLatestReviews(limit),
  });
};

async function fetchLatestReviews(limit: number) {
  // Fetch reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      id,
      created_at,
      rating,
      image_urls,
      user_id,
      review_text,
      cafe:cafes(id, name, address)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (reviewsError) {
    throw new Error('Error fetching latest reviews');
  }

  // Fetch user profiles
  const userIds = reviews.map(review => review.user_id);
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, username')
    .in('id', userIds);

  if (profilesError) {
    throw new Error('Error fetching user profiles');
  }

  // Combine review and profile data
  const reviewsWithProfiles = reviews.map(review => {
    const profile = profiles.find(p => p.id === review.user_id);
    return {
      ...review,
      user: profile ? {
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name
      } : null
    };
  });

  return reviewsWithProfiles;
}
