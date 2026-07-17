import os
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_module.py <module_name>")
        sys.exit(1)

    name = sys.argv[1]
    base_path = os.path.join("src", "module", name)
    os.makedirs(base_path, exist_ok=True)

    files = {
        f"{name}.controller.ts": f"""import {{ Router }} from "express";

const router = Router();

export default router;
""",
        f"{name}.service.ts": f"""import {{ Request, Response }} from "express";

""",
        f"{name}.validate.ts": f"""import Joi from "joi";

""",
    }

    for filename, content in files.items():
        filepath = os.path.join(base_path, filename)
        if not os.path.exists(filepath):
            with open(filepath, "w") as f:
                f.write(content)
            print(f"  Created: {filepath}")
        else:
            print(f"  Skipped (exists): {filepath}")

if __name__ == "__main__":
    main()
