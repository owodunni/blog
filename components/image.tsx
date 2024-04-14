import { getAsset2, calculateSourceSet } from "../lib/images/index.ts";

export default function Image(
  { href, width, height, text, title }: {
    href: string;
    width: number;
    height: number;
    text: string;
    title?: string;
  },
) {
  return (
    <picture>
      {calculateSourceSet({ href, width, height }).map(({ type, srcset }) => (
        <source 
          type={type} 
          srcset={srcset} />
      ))}
      <img
        width={width.toString()}
        height={height.toString()}
        src={getAsset2(href, { width, height, format: "jpg", quality: 80 })}
        loading="lazy"
        decoding="async"
        alt={text}
        {...(title && { title })}
      />
    </picture>
  );
}
