"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { UPLOAD_RULES } from "@/lib/uploads";
import { uploadErrorMessage, uploadFile } from "./upload-client";

type GalleryUploadFieldProps = {
  /** Submitted as newline-separated URLs, matching the existing server action. */
  name: string;
  defaultValue?: string[];
  max?: number;
};

export function GalleryUploadField({
  name,
  defaultValue = [],
  max = 20,
}: GalleryUploadFieldProps) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [pending, setPending] = useState<{ id: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pasteValue, setPasteValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = max - urls.length - pending.length;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);

    const files = Array.from(fileList).slice(0, Math.max(0, remaining));
    if (files.length < fileList.length) {
      setError(`You can add up to ${max} images.`);
    }

    // Upload in parallel, but keep the order the user selected
    await Promise.all(
      files.map(async (file, index) => {
        const id = `${Date.now()}-${index}`;
        setPending((p) => [...p, { id, progress: 0 }]);
        try {
          const url = await uploadFile(file, "image", (progress) =>
            setPending((p) => p.map((x) => (x.id === id ? { ...x, progress } : x))),
          );
          setUrls((u) => [...u, url]);
        } catch (err) {
          setError(`${file.name}: ${uploadErrorMessage(err)}`);
        } finally {
          setPending((p) => p.filter((x) => x.id !== id));
        }
      }),
    );

    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, direction: -1 | 1) {
    setUrls((u) => {
      const next = [...u];
      const target = index + direction;
      if (target < 0 || target >= next.length) return u;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addPastedUrl() {
    const url = pasteValue.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Paste a full image link starting with https://");
      return;
    }
    setError(null);
    setUrls((u) => [...u, url]);
    setPasteValue("");
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={urls.join("\n")} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />

            <button
              type="button"
              onClick={() => setUrls((u) => u.filter((_, i) => i !== index))}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-2 bottom-2 flex justify-between">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-950 shadow disabled:opacity-0"
                aria-label="Move left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === urls.length - 1}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-950 shadow disabled:opacity-0"
                aria-label="Move right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {pending.map((p) => (
          <div
            key={p.id}
            className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-gray-300 bg-gray-50"
          >
            <div className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              {p.progress}%
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="grid aspect-[4/3] place-items-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
          >
            <span className="flex flex-col items-center gap-1 text-xs font-bold">
              <ImagePlus className="h-6 w-6" />
              Add photos
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={UPLOAD_RULES.image.accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex max-w-md gap-2">
        <input
          value={pasteValue}
          onChange={(e) => setPasteValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPastedUrl();
            }
          }}
          placeholder="…or paste an image link"
          className="h-9 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-gray-950"
        />
        <button
          type="button"
          onClick={addPastedUrl}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 hover:bg-gray-100"
        >
          <Link2 className="h-4 w-4" />
          Add
        </button>
      </div>

      <p className="text-xs font-medium text-gray-600">
        Select multiple photos at once and use the arrows to set the display order. Large photos
        are compressed automatically. {UPLOAD_RULES.image.label}.
      </p>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
