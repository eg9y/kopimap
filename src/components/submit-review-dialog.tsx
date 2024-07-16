import React, { useEffect, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./catalyst/dialog";
import { Button } from "./catalyst/button";
import { Field, Label } from "./catalyst/fieldset";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import { useUser } from "../hooks/use-user";
import { reviewAttributes } from "./lib/review-attributes";
import { useSubmitReview } from "../hooks/use-submit-review";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./lib/database.types";
import { CafeDetailedInfo } from "../types";
import { cn } from "./lib/utils";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export function SubmitReviewDialog({
  isOpen,
  setIsOpen,
  cafeDetailedInfo,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cafeDetailedInfo?: CafeDetailedInfo;
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();
  const { loggedInUser } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();

  const onSuccess = () => {
    toast.success(
      isUpdating
        ? t("submitReview.reviewUpdated")
        : t("submitReview.reviewSubmitted"),
      {
        description: isUpdating
          ? t("submitReview.updateSuccess")
          : t("submitReview.submitSuccess"),
        position: "top-right",
      }
    );
    setIsOpen(false);
    reset();
  };

  const { mutate } = useSubmitReview(
    onSuccess,
    cafeDetailedInfo ? cafeDetailedInfo.place_id : null,
    loggedInUser?.id ?? null
  );

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (loggedInUser && cafeDetailedInfo) {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", loggedInUser.id)
          .eq("cafe_id", cafeDetailedInfo.id!)
          .single();

        if (error) {
          if (error.code !== "PGRST116") {
            console.error("Error fetching existing review:", error);
          }
          setIsUpdating(false);
          return;
        }

        if (data) {
          // Populate form with existing review data
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as any, value);
          });
          setIsUpdating(true);
        } else {
          setIsUpdating(false);
          reset(); // Clear form if no existing review
        }
      }
    };

    fetchExistingReview();
  }, [loggedInUser, cafeDetailedInfo, setValue, reset]);

  const onSubmit = (data: FieldValues) => {
    if (!loggedInUser || !cafeDetailedInfo) {
      toast.warning(t("submitReview.unableToSubmit"), {
        description: t("submitReview.ensureLoginAndCafe"),
        position: "top-right",
      });
      return;
    }

    const reviewData: ReviewInsert = {
      ...data,
      cafe_id: cafeDetailedInfo.id,
      cafe_place_id: cafeDetailedInfo.place_id,
      user_id: loggedInUser.id,
      // Ensure rating is a number
      rating:
        typeof data.rating === "number" ? data.rating : parseFloat(data.rating),
    };

    mutate(reviewData);
  };

  if (!loggedInUser) {
    return (
      <Dialog
        open={isOpen && !!cafeDetailedInfo}
        onClose={() => setIsOpen(false)}
        className=""
      >
        <DialogTitle>{t("submitReview.createReview")}</DialogTitle>
        <DialogDescription>{t("submitReview.pleaseLogin")}</DialogDescription>
        <DialogBody>
          <Button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: import.meta.env.VITE_URL,
                },
              });
            }}
            color="green"
            className="cursor-pointer"
          >
            {t("submitReview.login")}
          </Button>
        </DialogBody>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen && !!cafeDetailedInfo}
      onClose={() => setIsOpen(false)}
      className="!max-w-[70vw] h-[90vh] flex flex-col overflow-y-auto"
    >
      <DialogTitle>
        {isUpdating
          ? t("submitReview.updateReview")
          : t("submitReview.createReview")}
        : {cafeDetailedInfo ? cafeDetailedInfo.name : t("loading")}
      </DialogTitle>
      <DialogDescription>
        {isUpdating
          ? t("submitReview.modifyingExisting")
          : t("submitReview.fillOptions")}
      </DialogDescription>
      <form onSubmit={handleSubmit(onSubmit)} className="grow">
        <DialogBody className="flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Overall Rating */}
            <div className="p-2 rounded-md bg-slate-100 w-full flex flex-col">
              <Field className="">
                <p className="text-base font-semibold">
                  {t("submitReview.overallRating")}
                </p>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: t("submitReview.ratingRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <div role="group" className="flex flex-col gap-2 pt-2">
                      <div className="flex flex-col">
                        <div className="max-w-[250px]">
                          <Rating
                            value={value}
                            itemStyles={{
                              itemShapes: RoundedStar,
                              activeFillColor: "white",
                              inactiveFillColor: "white",
                              activeBoxBorderColor: "#000",
                              inactiveBoxColor: "grey",
                              activeBoxColor: [
                                "#da1600",
                                "#db711a",
                                "#dcb000",
                                "#61bb00",
                                "#009664",
                              ],
                            }}
                            onChange={onChange}
                            spaceBetween="small"
                            spaceInside="medium"
                            transition="position"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {value
                              ? t(
                                  `ratingLabels.${CUSTOM_ITEM_LABELS[value - 1]}`
                                )
                              : t("submitReview.selectRating")}
                          </p>
                        </div>
                      </div>
                      {errors.rating && (
                        <span className="text-red-500 text-sm">
                          {errors.rating.message as string}
                        </span>
                      )}
                    </div>
                  )}
                />
              </Field>
            </div>
            {/* Images section (placeholder) */}
            <div className="p-2 rounded-md bg-slate-100 w-full flex flex-col">
              <p className="text-base font-semibold">
                {t("submitReview.images")}
              </p>
              <p className="text-slate-700">
                {t("submitReview.imageUploadComingSoon")}
              </p>
            </div>
            {/* Review attributes */}
            {reviewAttributes.map((attr) => (
              <div
                key={attr.category}
                className={cn(
                  `flex flex-col p-2 gap-4 rounded-md`,
                  attr.color === "lime" && "bg-lime-200",
                  attr.color === "fuchsia" && "bg-fuchsia-200",
                  attr.color === "purple" && "bg-purple-200",
                  attr.color === "emerald" && "bg-emerald-200",
                  attr.color === "blue" && "bg-blue-200",
                  attr.color === "orange" && "bg-orange-200"
                )}
              >
                <p
                  className={cn(
                    `text-base font-semibold`,
                    attr.color === "lime" && "text-lime-800",
                    attr.color === "fuchsia" && "text-fuchsia-800",
                    attr.color === "purple" && "text-purple-800",
                    attr.color === "emerald" && "text-emerald-800",
                    attr.color === "blue" && "text-blue-800",
                    attr.color === "orange" && "text-orange-800"
                  )}
                >
                  {t(`categories.${attr.category}`)}
                </p>
                {attr.attributes.map((attribute) => (
                  <Field key={attribute.name}>
                    <Label>{t(`attributes.${attribute.name}.name`)}</Label>
                    <Controller
                      name={attribute.name}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-1 flex-wrap">
                          {attribute.options.map((option) => (
                            <Button
                              key={option}
                              color={
                                field.value === option ? attr.color : "white"
                              }
                              className="cursor-pointer"
                              onClick={() => field.onChange(option)}
                            >
                              {t(
                                `attributes.${attribute.name}.options.${option}`
                              )}
                            </Button>
                          ))}
                        </div>
                      )}
                    />
                  </Field>
                ))}
              </div>
            ))}
          </div>
          {/* Error display */}
          {Object.keys(errors).length > 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">
                {t("submitReview.errorCorrection")}
              </strong>
              <ul className="mt-2 list-disc list-inside">
                {errors.rating && <li>{t("submitReview.ratingRequired")}</li>}
                {Object.keys(errors).length > 1 && (
                  <li>{t("submitReview.validationErrors")}</li>
                )}
              </ul>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            {t("submitReview.cancel")}
          </Button>
          <Button type="submit" color="emerald" className="cursor-pointer">
            {isUpdating ? t("submitReview.update") : t("submitReview.submit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
