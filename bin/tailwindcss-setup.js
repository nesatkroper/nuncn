import { execSync } from "child_process";
import fs from "fs-extra";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";

export const tailwindcssSetup = async () => {
    const spinner = ora();

    try {
        const { installTailwind } = await prompts({
            type: "confirm",
            name: "installTailwind",
            message: "Install Tailwind CSS and its dependencies?",
            initial: true,
        });

        if (!installTailwind) return;

        spinner.start("Installing Tailwind CSS...");

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

        spinner.succeed("Tailwind CSS installed successfully!");
    } catch (err) {
        spinner.fail("Tailwind CSS installation failed");
        throw new Error(`Tailwind setup failed: ${err.message}`);
    }
};