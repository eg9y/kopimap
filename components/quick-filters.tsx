import { PresentationIcon } from "lucide-react";

export const QuickFilters = () => {
  return (
    <div className="absolute top-4 left-4 z-[1] flex gap-2">
      <a className="cursor-pointer p-2 rounded-md bg-white/90 shadow-sm flex items-center gap-1">
        <img src="/musholla.svg" className="w-4 h-4" />
        <p className="font-bold text-xs">Ada Musholla</p>
      </a>
      <a className="cursor-pointer p-2 rounded-md bg-white/90 shadow-sm flex items-center gap-1">
        <PresentationIcon className="w-4 h-4 text-black" />
        <p className="font-bold text-xs">Ada Meeting Room</p>
      </a>
      <a className="cursor-pointer p-2 rounded-md bg-white/90 shadow-sm flex items-center gap-1">
        <PresentationIcon className="w-4 h-4 text-black" />
        <p className="font-bold text-xs">Indoor Smoking</p>
      </a>
      <a className="cursor-pointer p-2 rounded-md bg-white/90 shadow-sm flex items-center gap-1">
        <p className="font-bold text-xs">Banyak Meja</p>
      </a>
      <a className="cursor-pointer p-2 rounded-md bg-white/90 shadow-sm flex items-center gap-1">
        <p className="font-bold text-xs">Area Luar Luas</p>
      </a>
    </div>
  );
};
