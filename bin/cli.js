#!/usr/bin/env node
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import prompts from "prompts";
import { program } from "commander";
import { tailwindcssSetup } from "./tailwindcss-setup.js";
import { appComponentSetup } from "./app-component-setup.js";

const main = async () => {
    const spinner = ora("Setting up components...").start();
    const targetDir = "./src/components/app";

    try {
        if (fs.existsSync(targetDir)) {
            spinner.stop();
            const { overwrite } = await prompts({
                type: "confirm",
                name: "overwrite",
                message: "Components already exist. Overwrite?",
                initial: false,
            });

            if (!overwrite) {
                console.log(
                    chalk.yellow("Operation cancelled. No files were changed.")
                );
                process.exit(0);
            }
            spinner.start("Overwriting components...");
        }

        await appComponentSetup(targetDir, spinner);
        
        // Add a small delay to ensure spinner updates are visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await tailwindcssSetup(spinner);

        spinner.succeed(chalk.green("Components installed successfully! 🎉"));
    } catch (err) {
        spinner.stop(); // Stop spinner before showing error
        console.error(chalk.red(`\nError: ${err.message}`));
        console.error(chalk.gray(err.stack)); // Show stack trace in debug mode
        process.exit(1);
    }
};

program.command("add").description("Install your components").action(main);

program.parse(process.argv);