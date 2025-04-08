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

        try {
            execSync(`${packageManager} add -D tailwindcss@3 postcss autoprefixer`, {
                stdio: "inherit",
            });

            spinner.text = "Configuring Tailwind...";
            execSync("npx tailwindcss init -p", { stdio: "inherit" });
        } catch (err) {
            // More specific error handling
            if (err.message.includes('command not found')) {
                throw new Error(`Package manager (${packageManager}) not found. Make sure it's installed.`);
            } else {
                throw new Error(`Installation failed: ${err.message}`);
            }
        }
    } catch (err) {
        throw new Error(`Tailwind setup failed: ${err.message}`);
    }
};