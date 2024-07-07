import React from "react";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./catalyst/dialog";
import { Button } from "./catalyst/button";
import { Field, Label } from "./catalyst/fieldset";
import { Badge } from "./catalyst/badge";
import { useStore } from "../store";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import { useUser } from "./lib/use-user";
import { reviewAttributes } from "./lib/review-attributes";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CUSTOM_GROUP_LABEL_ID = "group_label";
const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];
const CUSTOM_ITEM_LABELS_IDS = [
  "label_1",
  "label_2",
  "label_3",
  "label_4",
  "label_5",
];

export function SubmitReviewDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { selectedCafe } = useStore();
  const { loggedInUser } = useUser();

  const onSubmit = async (data) => {
    try {
      if (!loggedInUser) {
        toast.warning("Login to Review", {
          description: "Please login to submit your review.",
          position: "top-right",
        });
        return;
      }
      const { data: review, error } = await supabase.from("reviews").upsert({
        cafe_id: selectedCafe.id,
        cafe_place_id: selectedCafe.place_id,
        user_id: loggedInUser.id,
        ...data,
      });

      if (error) throw error;

      toast.success("Review Submitted", {
        description: "Your review has been successfully submitted.",
        position: "top-right",
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Error", {
        description:
          "There was an error submitting your review. Please try again.",
        position: "top-right",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="!max-w-[70vw] h-[90vh] flex flex-col overflow-y-auto"
    >
      <DialogTitle>Review Cafe: {selectedCafe.name}</DialogTitle>
      <DialogDescription>
        Fill in the options you'd like to review. Only the overall rating is
        required.
      </DialogDescription>
      <form onSubmit={handleSubmit(onSubmit)} className="grow">
        <DialogBody className="flex flex-col gap-2">
          {Object.keys(errors).length > 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">
                Please correct the following errors:
              </strong>
              <ul className="mt-2 list-disc list-inside">
                {errors.rating && <li>Overall rating is required</li>}
                {Object.keys(errors).length > 1 && (
                  <li>Some fields have validation errors</li>
                )}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 rounded-md bg-slate-100 w-full flex flex-col">
              <Field className="">
                <Label className="text-base !font-semibold text-slate-800">
                  Overall Rating
                </Label>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: "Overall rating is required" }}
                  render={({ field: { onChange, value } }) => (
                    <div role="group" className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
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
                            visibleLabelId={CUSTOM_GROUP_LABEL_ID}
                            visibleItemLabelIds={CUSTOM_ITEM_LABELS_IDS}
                            spaceBetween="small"
                            spaceInside="medium"
                            transition="position"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {value
                              ? CUSTOM_ITEM_LABELS[value - 1]
                              : "Select a rating"}
                          </p>
                        </div>
                      </div>
                      {errors.rating && (
                        <span className="text-red-500 text-sm">
                          {errors.rating.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </Field>
            </div>
            <div className="p-2 rounded-md bg-slate-100 w-full flex flex-col">
              <div className="">Images</div>
            </div>
            {reviewAttributes.map((attr) => (
              <div
                key={attr.category}
                className={`flex flex-col p-2 gap-4 rounded-md bg-${attr.color}-100`}
              >
                <p className={`text-base font-semibold text-${attr.color}-800`}>
                  {attr.category}
                </p>
                {attr.attributes.map((attribute) => (
                  <Field key={attribute.name}>
                    <Label>{attribute.name}</Label>
                    <Controller
                      name={attribute.name.toLowerCase().replace(/\s+/g, "_")}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-1 flex-wrap">
                          {attribute.options.map((option) => (
                            <Badge
                              key={option}
                              color={
                                field.value === option ? attr.color : "zinc"
                              }
                              className="cursor-pointer"
                              onClick={() => field.onChange(option)}
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      )}
                    />
                  </Field>
                ))}
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" color="emerald" className="cursor-pointer">
            Submit Review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
