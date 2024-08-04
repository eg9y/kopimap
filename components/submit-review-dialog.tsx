import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { Rating } from 'react-simple-star-rating';

import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./catalyst/dialog";
import { Button } from "./catalyst/button";
import { Field, Label } from "./catalyst/fieldset";
import { reviewAttributes } from "./lib/review-attributes";
import { useSubmitReview } from "../hooks/use-submit-review";
import { createClient, Session } from "@supabase/supabase-js";
import { Database } from "./lib/database.types";
import { CafeDetailedInfo } from "../types";
import { cn } from "./lib/utils";
import { clientOnly } from "vike-react/clientOnly";
import { useUser } from "../hooks/use-user";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { LocalizedString } from "typesafe-i18n";

const CUSTOM_ITEM_LABELS = ["Bad", "Poor", "Average", "Great", "Excellent"];

type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface ImageUploadRef {
  triggerUpload: () => Promise<string[]>;
}

export function SubmitReviewDialog({
  isOpen,
  setIsOpen,
  cafeDetailedInfo,
  userReview,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cafeDetailedInfo?: CafeDetailedInfo;
  userReview?: ReviewInsert | null;
}) {
  const { LL } = useI18nContext();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();
  const { loggedInUser } = useUser();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);

  const ClientOnlyImageUpload = clientOnly(() => import('./image-upload').then(module => module.ImageUpload ));

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
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

  const { mutate } = useSubmitReview(
    onSuccess,
    cafeDetailedInfo ? cafeDetailedInfo.place_id : null,
    loggedInUser?.id ?? null
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
    let newUploadedUrls: string[] = [];

    if (selectedFiles.length > 0 && imageUploadRef.current) {
      try {
        newUploadedUrls = await imageUploadRef.current.triggerUpload();
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error(LL.submitReview.imageUploadError());
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);

    const reviewData: ReviewInsert = {
      ...data,
      cafe_id: cafeDetailedInfo.id,
      cafe_place_id: cafeDetailedInfo.place_id,
      user_id: loggedInUser.id,
      rating: typeof data.rating === "number" ? data.rating : parseFloat(data.rating),
      image_urls: [...existingImageUrls, ...newUploadedUrls],
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
      onClose={() => setIsOpen(false)}
      className="!max-w-[70vw] h-[90vh] flex flex-col overflow-y-auto"
    >
      <DialogTitle>
        {isUpdating
          ? LL.submitReview.updateReview()
          : LL.submitReview.createReview()}
        : {cafeDetailedInfo ? cafeDetailedInfo.name : "Loading..."}
      </DialogTitle>
      <DialogDescription>
        {isUpdating
          ? LL.submitReview.modifyingExisting()
          : LL.submitReview.fillOptions()}
      </DialogDescription>
      <form onSubmit={handleSubmit(onSubmit)} className="grow">
        <DialogBody className="flex flex-col gap-2 h-[70vh] overflow-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Overall Rating */}
            <div className="p-2 rounded-md bg-slate-100 w-full flex flex-col">
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
                              "#f1d045"
                            ]}
                            onPointerEnter={() => console.log('Enter')}
                            onPointerLeave={() => console.log('Leave')}
                            SVGclassName={`inline-block`}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {value
                              ? LL.ratingLabels[CUSTOM_ITEM_LABELS[Math.floor(value) - 1] as keyof typeof LL.ratingLabels]()
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
            {/* Images section */}
            <div className="p-2 rounded-md bg-slate-100 w-full flex flex-col">
              <p className="text-base font-semibold">
                {LL.submitReview.images()}
              </p>
              {sessionInfo && (
                <ClientOnlyImageUpload
                  ref={imageUploadRef}
                  onFilesSelected={handleFilesSelected}
                  onUploadComplete={(urls) => {
                    console.log('Uploaded URLs:', urls);
                  }}
                  sessionInfo={sessionInfo}
                />
              )}
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
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p>{LL.submitReview.newImagesToUpload()}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file.data)}
                        alt={`${LL.submitReview.newImage()} ${index + 1}`}
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
                  {LL.categories[attr.category as keyof typeof LL.categories]()}
                </p>
                {attr.attributes.map((attribute) => {
                  const attrName = attribute.name as keyof typeof LL.attributes;
                  const options = LL.attributes[attrName].options as Record<string, () => LocalizedString>;
                  return (
                  <Field key={attribute.name}>
                    <Label>{LL.attributes[attrName].name()}</Label>
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
                              {options[option]()}
                            </Button>
                          ))}
                        </div>
                      )}
                    />
                  </Field>
                )})}
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
                {LL.submitReview.errorCorrection()}
              </strong>
              <ul className="mt-2 list-disc list-inside">
                {errors.rating && <li>{LL.submitReview.ratingRequired()}</li>}
                {Object.keys(errors).length > 1 && (
                  <li>{LL.submitReview.validationErrors()}</li>
                )}
              </ul>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            {LL.submitReview.cancel()}
          </Button>
          <Button type="submit" color="emerald" className="cursor-pointer" disabled={isUploading}>
            {isUpdating ? LL.submitReview.update() : LL.submitReview.submit()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}