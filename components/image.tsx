import { calculateSourceSet, getAsset2 } from "../lib/images/index.ts";

export default function Image(
  {
    href,
    width,
    height,
    text,
    title,
    placeholderHref,
    className = "opacity-0 transition-opacity duration-500",
  }: {
    href: string;
    width: number;
    height: number;
    text: string;
    title?: string;
    placeholderHref?: string;
    className?: string;
  },
) {
  return (
    <figure className="relative">
      {placeholderHref
        ? (
          <img
            className="block"
            aria-hidden={true}
            width={width.toString()}
            height={height.toString()}
            src={placeholderHref}
            loading="eager"
            alt={text}
            {...(title && { title })}
          />
        )
        : null}
      <picture className="absolute block top-0 left-0">
        {calculateSourceSet({ href, width, height }).map(({ type, srcset }) => (
          <source
            type={type}
            srcset={srcset}
          />
        ))}
        <img
          className={className}
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          onLoad="this.style.opacity=1"
          width={width.toString()}
          height={height.toString()}
          src={getAsset2(href, { width, height, format: "jpg", quality: 80 })}
          alt={text}
          {...(title && { title })}
        />
      </picture>
    </figure>
  );
}
