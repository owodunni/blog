type Format = "avif" | "webp" | "jpg";
type ImageType = "image/avif" | "image/webp" | "image/jpeg";

export function calculateSourceSet(
  { href, width, height }: { href: string; width: number; height: number },
): { type: ImageType; srcset: string }[] {
  const aspectRatio = width / height;
  const sizes = [640, 768, 1024, 1280];
  const formats = [
    { format: "avif", name: "image/avif" },
    { format: "jpg", name: "image/jpeg" },
  ] as const satisfies readonly {
    readonly format: Format;
    readonly name: ImageType;
  }[];

  return formats.map(({ format, name }) => ({
    type: name,
    srcset: sizes
      .map((w) => {
        const h = Math.round(w / aspectRatio);
        const src = getAsset2(href, {
          width: w,
          height: h,
          format,
          quality: 0.8,
        });
        return `${src} ${w}w`;
      })
      .join(",\r\n"),
  }));
}

export function getAsset2(
  href: string,
  {
    width,
    height,
    quality,
    format,
  }: {
    width: number;
    height: number;
    quality: number;
    format: "png" | "jpg" | "avif" | "webp";
  },
): string {
  return `${href}?width=${width}&height=${height}&quality=${quality}&format=${format}`;
}
