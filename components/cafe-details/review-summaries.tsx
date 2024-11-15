import { useState } from "react";
import { InfoIcon, ListChecksIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "../catalyst/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/popover";

interface ReviewSummariesProps {
  summaries: string[];
}

export const ReviewSummaries = ({ summaries }: ReviewSummariesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (summaries.length === 0) return null;

  const displayedSummaries = isExpanded ? summaries : summaries.slice(0, 2);

  return (
    <div className="p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
            <ListChecksIcon className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            Review Highlights
          </h3>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              plain
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <InfoIcon className="size-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 text-sm leading-relaxed">
            <p className="text-gray-600 dark:text-gray-300">
              These review highlights are generated using AI based on reviews from Google Maps and KopiMap users to give you a quick overview of what people say about this café.
            </p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        {displayedSummaries.map((summary, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          </div>
        ))}
      </div>

      {summaries.length > 2 && (
        <Button
          plain
          className="w-full mt-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center justify-center gap-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show {summaries.length - 2} More Reviews <ChevronDownIcon className="size-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};