import { calculateSourceSet, getAsset2 } from "../lib/images/index.ts";

export default function Image(
  { href, width, height, text, title, placeholderHref }: {
    href: string;
    width: number;
    height: number;
    text: string;
    title?: string;
    placeholderHref?: string;
  },
) {
  return (
    <figure className="relative">
      {placeholderHref
        ? (
          <img
            aria-hidden={true}
            className="absolute"
            width={width.toString()}
            height={height.toString()}
            src={placeholderHref}
            loading="eager"
            alt={text}
            {...(title && { title })}
          />
        )
        : null}
      <picture className="absolute">
        {calculateSourceSet({ href, width, height }).map(({ type, srcset }) => (
          <source
            type={type}
            srcset={srcset}
          />
        ))}
        <img
          class="opacity-0 transition-opacity duration-300"
          onLoad="this.style.opacity=1"
          width={width.toString()}
          height={height.toString()}
          src={getAsset2(href, { width, height, format: "jpg", quality: 80 })}
          loading="lazy"
          decoding="async"
          alt={text}
          {...(title && { title })}
        />
      </picture>
    </figure>
  );
}
