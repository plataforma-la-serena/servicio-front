import "server-only";
import { spawn } from "node:child_process";
import { access, constants, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BIN =
  process.env.REALESRGAN_BIN ??
  `${process.env.HOME ?? ""}/.local/opt/realesrgan/realesrgan-ncnn-vulkan`;
const MODEL = process.env.REALESRGAN_MODEL ?? "realesr-animevideov3";
const SCALE = "2";
const TIMEOUT_MS = 180_000;

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("La mejora tardó demasiado"));
    }, TIMEOUT_MS);

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.slice(-300) || `Salió con código ${code}`));
      }
    });
  });
}

export async function enhanceImage(input: Buffer): Promise<Buffer> {
  await access(BIN, constants.X_OK);

  const dir = await mkdtemp(join(tmpdir(), "laserena-enhance-"));
  const inputPath = join(dir, "input.png");
  const outputPath = join(dir, "output.jpg");

  try {
    await writeFile(inputPath, input);
    await run(BIN, [
      "-i",
      inputPath,
      "-o",
      outputPath,
      "-n",
      MODEL,
      "-s",
      SCALE,
      "-f",
      "jpg",
    ]);
    return await readFile(outputPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
