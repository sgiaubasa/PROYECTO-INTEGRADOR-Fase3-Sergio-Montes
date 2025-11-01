// backend/src/utils/paths.js
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// __dirname = .../backend/src/utils
// Subimos a /backend:
const backendRoot = path.resolve(__dirname, "..", "..");

const paths = {
  backendRoot,                                   // .../backend
  src: path.resolve(backendRoot, "src"),
  public: path.resolve(backendRoot, "public"),
  data: path.resolve(backendRoot, "src", "data"),
  images: path.resolve(backendRoot, "public", "images"),
  imagesProducts: path.resolve(backendRoot, "public", "images", "products"),
};

export default paths;
