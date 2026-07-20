"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, getApiErrorMessage } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";

const DEFAULT_COVER_URL =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

const requiredItemSchema = z.object({
  value: z.string().trim().min(1, "This item cannot be empty").max(180),
});
const optionalItemSchema = z.object({
  value: z.string().trim().max(180),
});
const imageItemSchema = z.object({
  value: z
    .union([z.literal(""), z.url("Enter a valid image URL")])
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("https://") ||
        value.startsWith("http://"),
      "Image URL must use HTTP or HTTPS",
    ),
});

const experienceFormSchema = z
  .object({
    title: z.string().trim().min(3).max(140),
    shortDescription: z.string().trim().min(20).max(280),
    fullDescription: z.string().trim().min(50).max(10_000),
    category: z.string().trim().min(2).max(80),
    location: z.string().trim().min(2).max(120),
    country: z.string().trim().min(2).max(100),
    price: z.number().nonnegative("Price cannot be negative").max(1_000_000),
    durationHours: z.number().min(0.5).max(720),
    availableFrom: z.string().min(1, "Choose a starting date"),
    availableTo: z.string().min(1, "Choose an ending date"),
    imageUrls: z.array(imageItemSchema).max(12),
    highlights: z.array(requiredItemSchema).min(1, "Add at least one highlight").max(20),
    included: z.array(requiredItemSchema).min(1, "Add at least one included item").max(30),
    excluded: z.array(optionalItemSchema).max(30),
  })
  .refine(
    ({ availableFrom, availableTo }) =>
      !availableFrom || !availableTo || availableFrom <= availableTo,
    {
      message: "Ending date must be on or after the starting date",
      path: ["availableTo"],
    },
  );

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const categoryOptions = [
  "Adventure",
  "Art & Design",
  "Culture",
  "Culture & Food",
  "Cycling",
  "Food",
  "Hiking",
  "Local Life",
  "Nature",
  "Wildlife",
].map((category) => ({ value: category, label: category }));

const getPreviewUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

export default function AddItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      category: "",
      location: "",
      country: "",
      price: 0,
      durationHours: 1,
      availableFrom: "",
      availableTo: "",
      imageUrls: [{ value: "" }],
      highlights: [{ value: "" }],
      included: [{ value: "" }],
      excluded: [{ value: "" }],
    },
  });

  const images = useFieldArray({ control, name: "imageUrls" });
  const highlights = useFieldArray({ control, name: "highlights" });
  const included = useFieldArray({ control, name: "included" });
  const excluded = useFieldArray({ control, name: "excluded" });
  const watchedImages = useWatch({ control, name: "imageUrls" });
  const previewUrls = watchedImages
    .map(({ value }) => getPreviewUrl(value))
    .filter((value): value is string => value !== null);

  const createExperience = useMutation({
    mutationFn: async (values: ExperienceFormValues) => {
      const imageUrls = values.imageUrls
        .map(({ value }) => value.trim())
        .filter(Boolean);
      const response = await api.post<ApiSuccess<{ experience: Experience }>>(
        "/experiences",
        {
          title: values.title,
          shortDescription: values.shortDescription,
          fullDescription: values.fullDescription,
          category: values.category,
          location: values.location,
          country: values.country,
          price: values.price,
          durationHours: values.durationHours,
          availableFrom: values.availableFrom,
          availableTo: values.availableTo,
          imageUrls: imageUrls.length > 0 ? imageUrls : [DEFAULT_COVER_URL],
          highlights: values.highlights.map(({ value }) => value.trim()),
          included: values.included.map(({ value }) => value.trim()),
          excluded: values.excluded
            .map(({ value }) => value.trim())
            .filter(Boolean),
          status: "published",
        },
      );
      return response.data.data.experience;
    },
    onSuccess: async (experience) => {
      await queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience published successfully");
      router.push(`/experiences/${experience.slug}`);
    },
  });

  const serverError = createExperience.isError
    ? getApiErrorMessage(createExperience.error)
    : null;

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <ResponsiveContainer className="grid gap-9">
        <PageHeader
          eyebrow="Creator tools"
          title="Add a travel experience"
          description="Give travelers enough clear, specific information to understand the experience before they save it or add it to a plan."
        />

        {serverError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {serverError}
          </div>
        )}

        <form
          className="grid gap-7"
          onSubmit={handleSubmit((values) => {
            createExperience.reset();
            createExperience.mutate(values);
          })}
          noValidate
        >
          <Card className="grid gap-5">
            <h2 className="text-xl font-bold text-navy">Experience essentials</h2>
            <Input label="Title" placeholder="Old Dhaka Heritage and Food Walk" error={errors.title?.message} {...register("title")} />
            <div className="grid gap-5 md:grid-cols-2">
              <Select label="Category" placeholder="Choose a category" options={categoryOptions} error={errors.category?.message} {...register("category")} />
              <Input label="Location" placeholder="City or region" error={errors.location?.message} {...register("location")} />
              <Input label="Country" placeholder="Country" error={errors.country?.message} {...register("country")} />
              <Input label="Price (USD)" type="number" min="0" step="0.01" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
              <Input label="Duration in hours" type="number" min="0.5" step="0.5" error={errors.durationHours?.message} {...register("durationHours", { valueAsNumber: true })} />
            </div>
            <Textarea label="Short description" placeholder="Summarize what makes this experience valuable in 20–280 characters." error={errors.shortDescription?.message} {...register("shortDescription")} />
            <Textarea label="Full description" placeholder="Explain the route, context, pace, and what travelers should expect." error={errors.fullDescription?.message} className="min-h-48" {...register("fullDescription")} />
          </Card>

          <Card className="grid gap-5">
            <h2 className="text-xl font-bold text-navy">Availability</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Available from" type="date" error={errors.availableFrom?.message} {...register("availableFrom")} />
              <Input label="Available to" type="date" error={errors.availableTo?.message} {...register("availableTo")} />
            </div>
          </Card>

          <Card className="grid gap-5">
            <div><h2 className="text-xl font-bold text-navy">Image URLs</h2><p className="mt-1 text-sm text-slate-600">Optional. Add up to 12 HTTP(S) images. If left empty, RouteMuse uses its default travel cover.</p></div>
            {images.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <Input label={`Image ${index + 1}`} placeholder="https://images.example.com/experience.jpg" error={errors.imageUrls?.[index]?.value?.message} className="flex-1" {...register(`imageUrls.${index}.value`)} />
                <button type="button" onClick={() => images.remove(index)} disabled={images.fields.length === 1} aria-label={`Remove image ${index + 1}`} className="mt-7 grid size-11 shrink-0 place-items-center rounded-xl border bg-white text-slate-600 disabled:opacity-40"><Minus className="size-4" /></button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => images.append({ value: "" })} disabled={images.fields.length >= 12} className="w-fit"><Plus className="size-4" />Add image URL</Button>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(previewUrls.length > 0 ? previewUrls : [DEFAULT_COVER_URL]).map((url, index) => (
                <div key={`${url}-${index}`} role="img" aria-label={previewUrls.length > 0 ? `Experience image preview ${index + 1}` : "Default RouteMuse cover preview"} className="aspect-[4/3] rounded-xl bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(url)})` }} />
              ))}
            </div>
          </Card>

          <Card className="grid gap-7">
            <RepeatableSection title="Highlights" description="Add the most memorable or distinctive parts." fields={highlights.fields} onAdd={() => highlights.append({ value: "" })} onRemove={highlights.remove} minimum={1} maximum={20} renderInput={(field, index) => <Input key={field.id} label={`Highlight ${index + 1}`} error={errors.highlights?.[index]?.value?.message} {...register(`highlights.${index}.value`)} />} />
            <RepeatableSection title="Included items" description="State exactly what the listed price covers." fields={included.fields} onAdd={() => included.append({ value: "" })} onRemove={included.remove} minimum={1} maximum={30} renderInput={(field, index) => <Input key={field.id} label={`Included item ${index + 1}`} error={errors.included?.[index]?.value?.message} {...register(`included.${index}.value`)} />} />
            <RepeatableSection title="Excluded items" description="Optional costs or arrangements travelers must handle." fields={excluded.fields} onAdd={() => excluded.append({ value: "" })} onRemove={excluded.remove} minimum={1} maximum={30} renderInput={(field, index) => <Input key={field.id} label={`Excluded item ${index + 1}`} error={errors.excluded?.[index]?.value?.message} {...register(`excluded.${index}.value`)} />} />
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={createExperience.isPending} className="min-w-48">
              Publish experience
            </Button>
          </div>
        </form>
      </ResponsiveContainer>
    </main>
  );
}

interface RepeatableSectionProps {
  title: string;
  description: string;
  fields: Array<{ id: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  minimum: number;
  maximum: number;
  renderInput: (field: { id: string }, index: number) => React.ReactNode;
}

function RepeatableSection({ title, description, fields, onAdd, onRemove, minimum, maximum, renderInput }: RepeatableSectionProps) {
  return (
    <section className="grid gap-4 border-b pb-7 last:border-0 last:pb-0">
      <div><h2 className="text-xl font-bold text-navy">{title}</h2><p className="mt-1 text-sm text-slate-600">{description}</p></div>
      {fields.map((field, index) => <div key={field.id} className="flex items-start gap-2"><div className="flex-1">{renderInput(field, index)}</div><button type="button" onClick={() => onRemove(index)} disabled={fields.length <= minimum} aria-label={`Remove ${title.toLowerCase()} item ${index + 1}`} className="mt-7 grid size-11 shrink-0 place-items-center rounded-xl border bg-white text-slate-600 disabled:opacity-40"><Minus className="size-4" /></button></div>)}
      <Button type="button" variant="outline" onClick={onAdd} disabled={fields.length >= maximum} className="w-fit"><Plus className="size-4" />Add {title.toLowerCase()}</Button>
    </section>
  );
}
