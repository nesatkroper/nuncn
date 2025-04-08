import { execSync } from "child_process";
import fs from "fs-extra";
import chalk from "chalk";
import prompts from "prompts";

export const tailwindcssSetup = async (spinner) => {
    try {
        const { installTailwind } = await prompts({
            type: "confirm",
            name: "installTailwind",
            message: "Install Tailwind CSS and its dependencies?",
            initial: true,
        });

        if (!installTailwind) return;

        spinner.text = "Installing Tailwind CSS...";

        const packageManager = fs.existsSync("yarn.lock")
            ? "yarn"
            : fs.existsSync("pnpm-lock.yaml")
                ? "pnpm"
                : "npm";

        execSync(`${packageManager} add -D tailwindcss@3 postcss autoprefixer`, {
            stdio: "inherit",
        });

        spinner.text = "Configuring Tailwind...";
        execSync("npx tailwindcss init -p", { stdio: "inherit" });
    } catch (err) {
        throw new Error(`Tailwind setup failed: ${err.message}`);
    }
};