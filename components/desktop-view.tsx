import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import MainSidebar from "./main-sidebar";
import { SubmitReviewDialog } from "./submit-review-dialog";
import { useCafeDetailedInfo } from "@/hooks/use-cafe-detailed-info";
import { useStore } from "@/store";
import { useUserReview } from "@/hooks/use-user-review";
import { useUser } from "@/hooks/use-user";

const MapComponent = lazy(() => import("../components/map-component"));
const SearchFilters = lazy(() => import("../components/search-filters"));
const CafeDetails = lazy(() => import("../components/cafe-details"));

// Loading components
const MapComponentLoader = () => (
  <div className="w-full h-full bg-gray-200 animate-pulse">Loading Map...</div>
);

const SearchFiltersLoader = () => (
  <div className="w-[200px] h-full bg-gray-100 animate-pulse">
    Loading Filters...
  </div>
);
const CafeDetailsLoader = () => (
  <div className="w-full h-full bg-white animate-pulse">
    Loading Cafe Details...
  </div>
);

export default function DesktopView({
  openFilters,
  pmTilesReady,
}: {
  openFilters: boolean;
  pmTilesReady: boolean;
}) {
  const { loggedInUser } = useUser();
  const { selectedCafe } = useStore();
  const [openSubmitReviewDialog, setOpenSubmitReviewDialog] = useState(false);

  const { data: userReview } = useUserReview(
    loggedInUser ? loggedInUser.id : null,
    selectedCafe?.id || null
  );

  const { data: cafeDetailedInfo } = useCafeDetailedInfo(
    selectedCafe?.id || null
  );

  return (
    <Suspense fallback={<div>Loading desktop view...</div>}>
      <MainSidebar>
        <div className="overflow-hidden grow relative h-full">
          <Suspense fallback={<MapComponentLoader />}>
            {openFilters && (
              <div className="z-[90] absolute w-[200px] h-full top-0 left-0 flex flex-col justify-end">
                <Suspense fallback={<SearchFiltersLoader />}>
                  <SearchFilters />
                </Suspense>
              </div>
            )}
            {pmTilesReady && <MapComponent />}
          </Suspense>
        </div>
      </MainSidebar>
      {selectedCafe && (
        <AnimatePresence>
          <Suspense fallback={<CafeDetailsLoader />}>
            <>
              <motion.div
                className={
                  "ml-[430px] z-10 h-[calc(100%_-_56px_-0.5rem)] min-w-[400px] w-[30vw] overflow-y-scroll pointer-events-auto bg-slate-50 absolute ring-1 ring-slate-300 shadow-md flex flex-col gap-2"
                }
                animate={{
                  width: "30vw",
                  minWidth: "500px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <CafeDetails
                  cafeDetailedInfo={cafeDetailedInfo}
                  setOpenSubmitReviewDialog={setOpenSubmitReviewDialog}
                  userReview={userReview}
                />
              </motion.div>

              <SubmitReviewDialog
                isOpen={openSubmitReviewDialog}
                setIsOpen={setOpenSubmitReviewDialog}
                cafeDetailedInfo={cafeDetailedInfo}
                userReview={userReview}
              />
            </>
          </Suspense>
        </AnimatePresence>
      )}
    </Suspense>
  );
}
