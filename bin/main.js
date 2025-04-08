#!/usr/bin/env node
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import prompts from "prompts";
import { program } from "commander";
import { tailwindcssSetup } from "./tailwindcss-setup.js";
import { appComponentSetup } from "./app-component-setup.js";

const main = async () => {
    let spinner = ora("Setting up components...").start();
    const targetDir = "./src/components/app";

    try {
        // Check if components exist
        if (fs.existsSync(targetDir)) {
            spinner.stop();
            const { overwrite } = await prompts({
                type: "confirm",
                name: "overwrite",
                message: "Components already exist. Overwrite?",
                initial: false,
            });

            if (!overwrite) {
                console.log(chalk.yellow("Operation cancelled. No files were changed."));
                process.exit(0);
            }
            spinner.start("Overwriting components...");
        }

        // Download components
        await appComponentSetup(targetDir, spinner);

        // Stop spinner before showing Tailwind prompt
        spinner.stop();

        // Run Tailwind setup
        await tailwindcssSetup();

        // Show final success message
        spinner = ora().start();
        spinner.succeed(chalk.green("Components installed successfully! 🎉"));
    } catch (err) {
        spinner.stop();
        console.error(chalk.red(`\nError: ${err.message}`));
        process.exit(1);
    }
};

program.command("add").description("Install your components").action(main);
program.parse(process.argv);