import { useI18nContext } from "@/src/i18n/i18n-react";
import { MinusIcon } from "lucide-react";
import { Badge } from "./catalyst/badge";
import { reviewAttributes } from "./lib/review-attributes";
import { cn } from "./lib/utils";

interface AggregatedReviewsProps {
  aggregatedReview: any | null;
}

export const AggregatedReviews: React.FC<AggregatedReviewsProps> = ({
  aggregatedReview,
}) => {
  const { LL } = useI18nContext();

  if (!aggregatedReview) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {reviewAttributes.map((category, index) => (
        <div
          key={category.category}
          className={cn(
            "flex flex-col rounded-md p-2 gap-2",
            category.color === "orange" && "bg-orange-100",
            category.color === "blue" && "bg-blue-100",
            category.color === "emerald" && "bg-emerald-100",
            category.color === "purple" && "bg-purple-100",
            category.color === "yellow" && "bg-yellow-100",
            category.color === "fuchsia" && "bg-fuchsia-100",
            category.color === "lime" && "bg-lime-100",
            index === reviewAttributes.length - 1 &&
              reviewAttributes.length % 2 !== 0 &&
              "col-span-2"
          )}
        >
          {/* Rest of the component remains the same */}
          <p
            className={cn(
              "text-base font-bold letter leading-4 text-nowrap",
              category.color === "orange" && "text-orange-800",
              category.color === "blue" && "text-blue-800",
              category.color === "emerald" && "text-emerald-800",
              category.color === "purple" && "text-purple-800",
              category.color === "yellow" && "text-yellow-800",
              category.color === "fuchsia" && "text-fuchsia-800",
              category.color === "lime" && "text-lime-800"
            )}
          >
            {LL.categories[category.category as keyof typeof LL.categories]()}
          </p>
          <div className="flex flex-col gap-2">
            {category.attributes.map((attr) => {
              const modeKey =
                `${attr.name.toLowerCase()}_mode` as keyof any;
              const value = aggregatedReview[modeKey] as string;
              const attrName = attr.name as keyof typeof LL.attributes;

              let translation = value;
              if (
                value &&
                LL.attributes[attrName] &&
                "options" in LL.attributes[attrName]
              ) {
                const options = LL.attributes[attrName].options as Record<
                  string,
                  () => string
                >;
                Object.entries(options).forEach(([key, translationFn]) => {
                  if (modeKey === "has_musholla_mode") {
                    if (key.toLowerCase() === "yes" && !!value) {
                      translation = "Yes";
                    } else if (key.toLowerCase() === "no" && !value) {
                      translation = "No";
                    }
                  } else if (key.toLowerCase() === value.toLowerCase()) {
                    translation = translationFn();
                  }
                });
              }

              return (
                <div key={attr.name} className="">
                  <div className={cn("flex flex-col gap-1 w-full")}>
                    <div className="flex items-center gap-1">
                      {attr.icon && (
                        <attr.icon
                          className={cn(
                            "w-4 h-4",
                            category.color === "orange" && "text-orange-500",
                            category.color === "blue" && "text-blue-500",
                            category.color === "emerald" && "text-emerald-500",
                            category.color === "purple" && "text-purple-500",
                            category.color === "yellow" && "text-yellow-500",
                            category.color === "fuchsia" && "text-fuchsia-500",
                            category.color === "lime" && "text-lime-500"
                          )}
                        />
                      )}
                      <p
                        className={cn(
                          `text-xs font-semibold text-nowrap`,
                          category.color === "orange" && "text-orange-500",
                          category.color === "blue" && "text-blue-500",
                          category.color === "emerald" && "text-emerald-500",
                          category.color === "purple" && "text-purple-500",
                          category.color === "yellow" && "text-yellow-500",
                          category.color === "fuchsia" && "text-fuchsia-500",
                          category.color === "lime" && "text-lime-500"
                        )}
                      >
                        {LL.attributes[
                          attr.name as keyof typeof LL.attributes
                        ].name()}
                      </p>
                    </div>
                    <div className="pl-0 flex items-center gap-1 flex-wrap">
                      {value ? (
                        <Badge color={category.color}>{translation}</Badge>
                      ) : (
                        <Badge color={category.color} className="opacity-50">
                          <MinusIcon size={20} />
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
