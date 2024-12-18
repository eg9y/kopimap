import { useI18nContext } from "@/src/i18n/i18n-react";
import { useStore } from "@/store";
import { Session, createClient } from "@supabase/supabase-js";
import { LoaderCircle, XIcon } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { toast } from "sonner";
import { LocalizedString } from "typesafe-i18n";
import { useSubmitReview } from "../../hooks/use-submit-review";
import { useUser } from "../../hooks/use-user";
import { CafeDetailedInfo, ReviewWithStringMusholla } from "../../types";
import { Button } from "../catalyst/button";
import { Field, Label } from "../catalyst/fieldset";
import { ExtendedMetadata, ImageUpload, useImageUpload } from "../image-upload";
import { Database } from "../lib/database.types";
import { reviewAttributes } from "../lib/review-attributes";
import { cn } from "../lib/utils";

import "@uppy/core/dist/style.min.css";
import "@uppy/status-bar/dist/style.min.css";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

type ReviewInsert = any;

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function MobileSubmitReview({
  cafeDetailedInfo,
  userReview,
  onClose,
  sessionInfo,
}: {
  cafeDetailedInfo: CafeDetailedInfo;
  userReview?: ReviewWithStringMusholla | null;
  onClose: () => void;
  sessionInfo: Session;
}) {
  const { LL } = useI18nContext();
  const { setOpenSubmitReviewDialog } = useStore();
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
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [uppy] = useState(() =>
    new Uppy<ExtendedMetadata>({
      id: "imageUploader",
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 4,
        allowedFileTypes: ["image/*"],
      },
      meta: {
        placeId: cafeDetailedInfo.place_id!,
      },
    }).use(XHRUpload, {
      endpoint: `${import.meta.env.VITE_MEILISEARCH_URL}/api/upload-image`,
      headers: {
        authorization: `Bearer ${sessionInfo.access_token}`,
      },
      fieldName: "file",
      formData: true,
      allowedMetaFields: ["placeId", "reviewId", "label", "classification"],
      limit: 1,
    })
  );
  const { startUpload, getSelectedFiles } = useImageUpload(uppy!);

  useEffect(() => {
    if (userReview) {
      setIsUpdating(true);
      Object.entries(userReview).forEach(([key, value]) => {
        setValue(key, value);
      });
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

  const onSuccess = () => {
    onClose();
    reset();
    setSelectedFiles([]);
    setExistingImageUrls([]);
  };

  const { mutateAsync } = useSubmitReview(
    onSuccess,
    cafeDetailedInfo ? cafeDetailedInfo.place_id : null,
    loggedInUser ? loggedInUser.id : null
  );

  const handleUploadComplete = () => {
    setIsUploading(false);
    toast.success(
      isUpdating
        ? LL.submitReview.reviewUpdated()
        : LL.submitReview.reviewSubmitted(),
      {
        description: isUpdating
          ? LL.submitReview.updateSuccess()
          : LL.submitReview.submitSuccess(),
        position: "top-center",
      }
    );
    onClose();
    reset();
    setSelectedFiles([]);
    setExistingImageUrls([]);
  };

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      if (!loggedInUser || !cafeDetailedInfo || !sessionInfo) {
        toast.warning(LL.submitReview.unableToSubmit(), {
          description: LL.submitReview.ensureLoginAndCafe(),
          position: "top-center",
        });
        return;
      }

      const reviewData: ReviewInsert = {
        ...data,
        cafe_place_id: cafeDetailedInfo.place_id,
        user_id: loggedInUser.id,
        rating:
          typeof data.rating === "number"
            ? data.rating
            : parseFloat(data.rating),
      };

      try {
        delete reviewData.image_urls;
        const { id: reviewId } = await mutateAsync(reviewData);

        const selectedFiles = getSelectedFiles();
        if (selectedFiles.length > 0) {
          setIsUploading(true);
          const result = await startUpload(reviewId);
          if (result?.successful) {
            handleUploadComplete();
          }
        } else {
          handleUploadComplete();
        }
      } catch (error: any) {
        console.error("Error submitting review:", error);
        toast.error(
          `There was an error submitting your review: ${error.message}`
        );
        setIsUploading(false);
      }
    },
    [mutateAsync, startUpload, getSelectedFiles]
  );

  if (loadingUser) {
    return (
      <div className="pointer-events-auto z-[10000] dark:bg-slate-800 mx-2 p-4 flex flex-col items-center rounded-xl bg-white shadow-xl top-[40%] absolute inset-x-0 max-w-md">
        <LoaderCircle size={32} className="animate-spin" />
      </div>
    );
  }

  if (!loggedInUser) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        setShowErrorMessage(true);
      })}
      className="z-[100000] pointer-events-auto absolute inset-0 flex flex-col bg-white dark:bg-gray-900 dark:text-white"
    >
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold">
          {isUpdating
            ? LL.submitReview.updateReview()
            : LL.submitReview.createReview()}
          : {cafeDetailedInfo ? cafeDetailedInfo.name : "Loading..."}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isUpdating
            ? LL.submitReview.modifyingExisting()
            : LL.submitReview.fillOptions()}
        </p>
      </div>

      <div className="flex flex-col h-full overflow-y-scroll">
        <div className="flex-grow overflow-auto p-4">
          <div className="flex flex-col gap-4">
            {/* Overall Rating */}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-gray-800">
              <Field>
                <p className="text-base font-semibold mb-2">
                  {LL.submitReview.overallRating()}
                </p>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: LL.submitReview.ratingRequired() }}
                  render={({ field: { onChange, value } }) => (
                    <div role="group" className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <Rating
                          onClick={onChange}
                          initialValue={value}
                          allowFraction
                          size={24}
                          transition={false}
                          fillColorArray={[
                            "#f14f45",
                            "#f16c45",
                            "#f18845",
                            "#f1b345",
                            "#f1d045",
                          ]}
                          SVGclassName="inline-block"
                        />
                        <p className="font-bold text-base mt-1">
                          {value
                            ? LL.ratingLabels[
                                CUSTOM_ITEM_LABELS[
                                  Math.floor(value) - 1
                                ] as keyof typeof LL.ratingLabels
                              ]()
                            : LL.submitReview.selectRating()}
                        </p>
                      </div>
                      {errors.rating && (
                        <span className="text-red-500 dark:text-red-400 text-sm">
                          {errors.rating.message as string}
                        </span>
                      )}
                    </div>
                  )}
                />
              </Field>
            </div>

            {/* Review Text */}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-gray-800">
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
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={4}
                        placeholder={LL.submitReview.reviewTextPlaceholder()}
                      />
                      {errors.review_text && (
                        <span className="text-red-500 dark:text-red-400 text-sm">
                          {errors.review_text.message as string}
                        </span>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {field.value ? field.value.length : 0}/500
                      </p>
                    </div>
                  )}
                />
              </Field>
            </div>

            {/* Images section */}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-gray-800">
              <p className="text-base font-semibold mb-2">
                {LL.submitReview.images()}
              </p>
              {sessionInfo && (
                <ImageUpload
                  sessionInfo={sessionInfo}
                  placeId={cafeDetailedInfo.place_id!}
                  onUploadStart={() => setIsUploading(true)}
                  onUploadComplete={handleUploadComplete}
                  uppy={uppy}
                />
              )}
              {existingImageUrls.length > 0 && (
                <div className="mt-2">
                  <p>{LL.submitReview.existingImages()}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {existingImageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${LL.submitReview.existingImages()} ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
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
                  "flex flex-col p-2 gap-3 rounded-md",
                  "dark:bg-gray-800",
                  attr.color === "lime" && "bg-lime-100",
                  attr.color === "fuchsia" && "bg-fuchsia-100",
                  attr.color === "purple" && "bg-purple-100",
                  attr.color === "emerald" && "bg-emerald-100",
                  attr.color === "blue" && "bg-blue-100",
                  attr.color === "orange" && "bg-orange-100"
                )}
              >
                <p className="text-base font-semibold text-white">
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
                      <Label className="text-sm text-gray-300">
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
                                  "cursor-pointer text-xs py-1 px-2",
                                  "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                                  field.value === option &&
                                    `dark:bg-${attr.color}-600 dark:text-white`
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
        </div>
      </div>
      {/* Fixed footer with Submit and Cancel buttons */}
      <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-900 p-4 justify-end gap-2 flex flex-col">
        {/* Error display */}
        {showErrorMessage && Object.keys(errors).length > 0 && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative my-4">
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
              className="absolute top-0 right-0 mt-2 mr-2 text-red-700 dark:text-red-200"
              type="button"
            >
              <XIcon size={16} />
            </button>
          </div>
        )}
        <div className="flex flex-col z-[10000]">
          <div className="flex">
            <Button plain onClick={onClose} className="grow dark:text-white">
              {LL.submitReview.cancel()}
            </Button>
            <Button
              type="submit"
              color="emerald"
              className="cursor-pointer grow"
              disabled={isUploading}
            >
              {isUpdating ? LL.submitReview.update() : LL.submitReview.submit()}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
