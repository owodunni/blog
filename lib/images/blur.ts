import { decode, encode } from "blurhash";
import sharp from "sharp";

export interface IOptions {
  size?: number;
}

export interface IOutput {
  encoded: string;
  width: number;
  height: number;
}

/**
 * Generate a Blurhash string from a given image URL or local path.
 *
 * @param {string} source - The image URL or local path to the image file.
 * @param {IOptions} [options] - The optional configuration options.
 * @param {number} [options.size=32] - The desired size of the image for encoding the Blurhash.
 * @param {boolean} [options.offline=false] - Set to `true` if the image source is a local path, `false` if it's a URL.
 * @returns {Promise<IOutput>} The Promise that resolves to the encoded Blurhash string, along with the image width and height.
 * @default size 32
 * @default offline false
 * @example
 * ```js
 * import { blurhashFromURL } from "blurhash-from-url";
 *
 * const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png", {
 *    size: 32,
 * });
 *
 * console.log(output);
 * ```
 */
export const blurhashFromURL = async (
  source: string,
  options: IOptions = {},
): Promise<IOutput> => {
  const { size = 32 } = options;

  const response = await fetch(source);
  const arrayBuffer = await response.arrayBuffer();

  const { info, data } = await sharp(arrayBuffer)
    .resize(size, size, {
      fit: "inside",
    })
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true,
    });

  const encoded = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  );

  const output: IOutput = {
    encoded,
    width: info.width,
    height: info.height,
  };

  return output;
};

export const generateBlurhashURI = async (
  hash: string,
  width: number,
  height: number,
  options = {
    size: 16,
    quality: 40,
  },
) => {
  const hashWidth = options?.size;
  const hashHeight = Math.round(hashWidth * (height / width));

  const pixels = decode(hash, hashWidth, hashHeight);

  const resizedImageBuf = await sharp(pixels, {
    raw: {
      channels: 4,
      width: hashWidth,
      height: hashHeight,
    },
  })
    .jpeg({
      overshootDeringing: true,
      quality: 40,
    })
    .toBuffer(); // Here also possible to do whatever with your image, e.g. save it or something else.

  return `data:image/jpeg;base64,${
    btoa(String.fromCharCode(...new Uint8Array(resizedImageBuf)))
  }`;
};
