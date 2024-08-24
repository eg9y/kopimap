import React, { useCallback, Dispatch, SetStateAction, RefObject } from "react";
import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";
import { Badge } from "./catalyst/badge";
import { useCafes } from "@/hooks/use-cafes";
import useMedia from "react-use/esm/useMedia";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CafeListProps {
  searchInput: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export const MobileListTemp: React.FC<CafeListProps> = ({ searchInput, setIsOpen, isOpen, inputRef }) => {
  const { selectCafe, mapRef, mapCenter } = useStore();
  const isWide = useMedia("(min-width: 640px)");
  const { data } = useCafes(mapCenter.lat, mapCenter.long, searchInput);

  const allCafes = data?.pages.flatMap(page => page.cafes) ?? [];

  const handleCafeClick = useCallback((cafe: MeiliSearchCafe) => {
    selectCafe(cafe);
    mapRef?.current?.flyTo({
      center: {
        lat: cafe._geo.lat! - (isWide ? 0 : 0.005),
        lon: cafe._geo.lng! - (isWide ? 0.01 : 0.0),
      },
      zoom: 14,
    });
    setIsOpen(false);
  }, [selectCafe, mapRef, isWide, setIsOpen]);

  return (
    <Transition show={isOpen} as={React.Fragment} afterEnter={() => {
      inputRef.current?.focus();
    }}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-45">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="fixed inset-x-0 top-16 bottom-28 flex items-center justify-center p-4">
            <Dialog.Panel className="size-full max-w-md rounded-xl bg-white shadow-xl max-h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <Dialog.Title className="text-lg font-semibold">
                  Places ({allCafes.length})
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                {searchInput && (
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm text-blue-700">Showing results for "{searchInput}"</p>
                  </div>
                )}
                {allCafes.map((cafe: MeiliSearchCafe) => (
                  <div
                    key={cafe.id}
                    onClick={() => handleCafeClick(cafe)}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="grow w-full">
                      <p className="font-semibold text-nowrap text-ellipsis overflow-hidden">
                        {cafe.name}
                      </p>
                      <div className="flex gap-2 my-1">
                        <Badge color="red" className="text-xs">
                          {cafe.gmaps_rating} ★ ({cafe.gmaps_total_reviews.toLocaleString("id-ID")})
                        </Badge>
                        {cafe.avg_rating && (
                          <Badge color="red" className="text-xs">
                            Our rating: {cafe.avg_rating} ({cafe.review_count})
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 text-ellipsis text-nowrap overflow-hidden">
                        {cafe.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
