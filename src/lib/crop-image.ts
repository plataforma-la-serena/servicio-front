export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const OUTPUT_WIDTH = 1600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    image.src = src;
  });
}

export async function cropToJpeg(
  src: string,
  area: CropArea,
): Promise<Blob> {
  const image = await loadImage(src);
  const ratio = area.height / area.width;
  const width = Math.min(OUTPUT_WIDTH, Math.round(area.width));
  const height = Math.round(width * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No se pudo preparar el recorte");
  }

  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    width,
    height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("No se pudo recortar la imagen"));
        }
      },
      "image/jpeg",
      0.92,
    );
  });
}
