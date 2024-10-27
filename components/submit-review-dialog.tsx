// SubmitReviewDialog.tsx

import { LoaderCircle, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { toast } from "sonner";

import { useI18nContext } from "@/src/i18n/i18n-react";
import { Session, createClient } from "@supabase/supabase-js";
import { LocalizedString } from "typesafe-i18n";
import { useSubmitReview } from "../hooks/use-submit-review";
import { useUser } from "../hooks/use-user";
import { CafeDetailedInfo, ReviewWithStringMusholla } from "../types";
import { Button } from "./catalyst/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "./catalyst/dialog";
import { Field, Label } from "./catalyst/fieldset";
import { ImageUpload, ImageUploadRef } from "./image-upload";
import { Database } from "./lib/database.types";
import { reviewAttributes } from "./lib/review-attributes";
import { cn } from "./lib/utils";
import { StatusBar } from "@uppy/react";

import "@uppy/core/dist/style.min.css";
import "@uppy/status-bar/dist/style.min.css";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function SubmitReviewDialog({
  isOpen,
  setIsOpen,
  cafeDetailedInfo,
  userReview,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cafeDetailedInfo?: CafeDetailedInfo;
  userReview?: ReviewWithStringMusholla | null;
}) {
  const { LL } = useI18nContext();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();
  const { loggedInUser, loadingUser } = useUser();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSessionInfo(session);
    })();
  }, []);

  useEffect(() => {
    if (userReview) {
      setIsUpdating(true);
      // Pre-fill the form with existing review data
      Object.entries(userReview).forEach(([key, value]) => {
        setValue(key, value);
      });
      // Set existing images if any
      if (userReview.image_urls) {
        setExistingImageUrls(userReview.image_urls);
      }
    } else {
      setIsUpdating(false);
      reset();
      setExistingImageUrls([]);
    }
    setSelectedFiles([]);
  }, [userReview, setValue, reset]);

  const handleFilesSelected = (files: any[]) => {
    setSelectedFiles(files);
  };

  const onSuccess = () => {
    toast.success(
      isUpdating
        ? LL.submitReview.reviewUpdated()
        : LL.submitReview.reviewSubmitted(),
      {
        description: isUpdating
          ? LL.submitReview.updateSuccess()
          : LL.submitReview.submitSuccess(),
        position: "top-right",
      }
    );
    setIsOpen(false);
    reset();
    setSelectedFiles([]);
    setExistingImageUrls([]);
  };

  const { mutateAsync } = useSubmitReview(
    onSuccess,
    cafeDetailedInfo ? cafeDetailedInfo.place_id : null,
    loggedInUser ? loggedInUser.id : null
  );

  const onSubmit = async (data: FieldValues) => {
    if (!loggedInUser || !cafeDetailedInfo) {
      toast.warning(LL.submitReview.unableToSubmit(), {
        description: LL.submitReview.ensureLoginAndCafe(),
        position: "top-right",
      });
      return;
    }

    setIsUploading(true);

    const payload = { ...data };

    const finalPayload = {
      ...payload,
    };

    delete finalPayload.image_urls;

    const reviewData: ReviewInsert = {
      ...finalPayload,
      cafe_place_id: cafeDetailedInfo.place_id,
      user_id: loggedInUser.id,
      rating:
        typeof finalPayload.rating === "number"
          ? finalPayload.rating
          : parseFloat(finalPayload.rating),
    };

    try {
      // Submit the review and get the reviewId
      const { id: reviewId } = await mutateAsync(reviewData);

      // Upload images with the reviewId
      if (selectedFiles.length > 0 && imageUploadRef.current) {
        try {
          await imageUploadRef.current.triggerUpload(reviewId);
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.error(LL.submitReview.imageUploadError());
          setIsUploading(false);
          return;
        }
      }

      setIsUploading(false);

      // Success toast and reset form
      toast.success(
        isUpdating
          ? LL.submitReview.reviewUpdated()
          : LL.submitReview.reviewSubmitted(),
        {
          description: isUpdating
            ? LL.submitReview.updateSuccess()
            : LL.submitReview.submitSuccess(),
          position: "top-right",
        }
      );
      setIsOpen(false);
      reset();
      setSelectedFiles([]);
      setExistingImageUrls([]);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(
        `There was an error submitting your review: ${error.message}. Please try again.`
      );
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setSelectedFiles([]);
    setExistingImageUrls([]);
    if (imageUploadRef.current) {
      imageUploadRef.current?.uppy.clear();
    }
  };

  if (loadingUser) {
    return (
      <Dialog
        open={isOpen && !!cafeDetailedInfo}
        onClose={() => setIsOpen(false)}
        className="z-50"
      >
        <DialogBody className="flex justify-center items-center">
          <LoaderCircle size={32} className="animate-spin" />
        </DialogBody>
      </Dialog>
    );
  }

  if (loggedInUser === false) {
    return (
      <Dialog
        open={isOpen && !!cafeDetailedInfo}
        onClose={() => setIsOpen(false)}
        className="z-50"
      >
        <DialogTitle>{LL.submitReview.createReview()}</DialogTitle>
        <DialogDescription>{LL.submitReview.pleaseLogin()}</DialogDescription>
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
            {LL.submitReview.login()}
          </Button>
        </DialogBody>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen && !!cafeDetailedInfo}
      onClose={handleClose}
      className="!max-w-[70vw] flex flex-col overflow-y-auto dark:bg-gray-800 dark:text-white"
    >
      <DialogTitle className="dark:text-white">
        {isUpdating
          ? LL.submitReview.updateReview()
          : LL.submitReview.createReview()}
        : {cafeDetailedInfo ? cafeDetailedInfo.name : "Loading..."}
      </DialogTitle>
      <DialogDescription className="dark:text-gray-300">
        {isUpdating
          ? LL.submitReview.modifyingExisting()
          : LL.submitReview.fillOptions()}
      </DialogDescription>
      <form
        onSubmit={handleSubmit(onSubmit, () => setShowErrorMessage(true))}
        className="grow"
      >
        <DialogBody className="flex flex-col gap-2 h-[60vh] overflow-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Overall Rating */}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-gray-700 w-full flex flex-col">
              <Field className="">
                <p className="text-base font-semibold">
                  {LL.submitReview.overallRating()}
                </p>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: LL.submitReview.ratingRequired() }}
                  render={({ field: { onChange, value } }) => (
                    <div role="group" className="flex flex-col gap-2 pt-2">
                      <div className="flex flex-col">
                        <div className="max-w-[250px]">
                          <Rating
                            onClick={onChange}
                            initialValue={value}
                            allowFraction
                            size={30}
                            transition={false}
                            fillColorArray={[
                              "#f14f45",
                              "#f16c45",
                              "#f18845",
                              "#f1b345",
                              "#f1d045",
                            ]}
                            onPointerEnter={() => console.log("Enter")}
                            onPointerLeave={() => console.log("Leave")}
                            SVGclassName={`inline-block`}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {value
                              ? LL.ratingLabels[
                                  CUSTOM_ITEM_LABELS[
                                    Math.floor(value) - 1
                                  ] as keyof typeof LL.ratingLabels
                                ]()
                              : LL.submitReview.selectRating()}
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
            {/* Review Text */}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-gray-700 w-full flex flex-col">
              <Field>
                <p className="text-base font-semibold mb-2">
                  {LL.submitReview.reviewText()}
                </p>
                <Controller
                  name="review_text"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 500,
                      message: LL.submitReview.reviewTextTooLong(),
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <textarea
                        {...field}
                        className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
                        rows={4}
                        placeholder={LL.submitReview.reviewTextPlaceholder()}
                      />
                      {errors.review_text && (
                        <span className="text-red-500 text-sm">
                          {errors.review_text.message as string}
                        </span>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {field.value ? field.value.length : 0}/500
                      </p>
                    </div>
                  )}
                />
              </Field>
            </div>

            {/* Images section */}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-gray-700 w-full flex flex-col">
              <p className="text-base font-semibold">
                {LL.submitReview.images()}
              </p>
              {sessionInfo && cafeDetailedInfo && (
                <ImageUpload
                  ref={imageUploadRef}
                  onFilesSelected={handleFilesSelected}
                  sessionInfo={sessionInfo}
                  placeId={cafeDetailedInfo.place_id!}
                />
              )}
              {/* Existing images display (if any) */}
              {existingImageUrls.length > 0 && (
                <div className="mt-2">
                  <p>{LL.submitReview.existingImages()}</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${LL.submitReview.existingImages()} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Review attributes */}
            {reviewAttributes.map((attr) => (
              <div
                key={attr.category}
                className={cn(
                  `flex flex-col p-2 gap-4 rounded-md`,
                  "dark:bg-gray-700", // Uniform dark color for dark mode
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
                    "dark:text-white", // White text for dark mode
                    attr.color === "lime" && "text-lime-800",
                    attr.color === "fuchsia" && "text-fuchsia-800",
                    attr.color === "purple" && "text-purple-800",
                    attr.color === "emerald" && "text-emerald-800",
                    attr.color === "blue" && "text-blue-800",
                    attr.color === "orange" && "text-orange-800"
                  )}
                >
                  {LL.categories[attr.category as keyof typeof LL.categories]()}
                </p>
                {attr.attributes.map((attribute) => {
                  const attrName = attribute.name as keyof typeof LL.attributes;
                  const options = LL.attributes[attrName].options as Record<
                    string,
                    () => LocalizedString
                  >;
                  return (
                    <Field key={attribute.name}>
                      <Label className="dark:text-gray-300">
                        {LL.attributes[attrName].name()}
                      </Label>
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
                                className={cn(
                                  "cursor-pointer",
                                  "dark:bg-gray-600 dark:text-white",
                                  field.value === option && "dark:bg-gray-500"
                                )}
                                onClick={() => {
                                  if (field.value === option) {
                                    field.onChange(null);
                                  } else {
                                    field.onChange(option);
                                  }
                                }}
                              >
                                {options[option]()}
                              </Button>
                            ))}
                          </div>
                        )}
                      />
                    </Field>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Error display */}
          {showErrorMessage && Object.keys(errors).length > 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900 dark:border-red-700 dark:text-red-200"
              role="alert"
            >
              <strong className="font-bold">
                {LL.submitReview.errorCorrection()}
              </strong>
              <ul className="mt-2 list-disc list-inside">
                {errors.rating && <li>{LL.submitReview.ratingRequired()}</li>}
                {errors.review_text && (
                  <li>{errors.review_text.message as string}</li>
                )}
              </ul>
              <button
                onClick={() => setShowErrorMessage(false)}
                className="absolute top-0 right-0 mt-2 mr-2 text-red-700"
                type="button"
              >
                <XIcon size={16} />
              </button>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          {/* Uppy StatusBar */}
          {imageUploadRef.current?.uppy && (
            <StatusBar
              uppy={imageUploadRef.current?.uppy}
              hideAfterFinish={false}
              showProgressDetails={true}
              hideUploadButton={true}
              hideRetryButton={false}
              hidePauseResumeButton={false}
              hideCancelButton={false}
            />
          )}
          <Button plain onClick={handleClose} className="dark:text-gray-300">
            {LL.submitReview.cancel()}
          </Button>
          <Button
            type="submit"
            color="emerald"
            className="cursor-pointer dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:text-white"
            disabled={isUploading}
          >
            {isUpdating ? LL.submitReview.update() : LL.submitReview.submit()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
