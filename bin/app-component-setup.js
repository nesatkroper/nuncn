import degit from "degit";

export const appComponentSetup = async (targetDir, spinner) => {
    try {
        spinner.text = "Downloading components...";
        const emitter = degit("nesatkroper/own-components/components", {
            force: true,
            verbose: true, // Add verbose logging
        });

        // Add progress events
        emitter.on('info', (info) => {
            spinner.text = `Downloading components... ${info.message}`;
        });

        await emitter.clone(targetDir);
        spinner.text = "Components downloaded successfully!";
    } catch (error) {
        throw new Error(`Failed to download components: ${error.message}`);
    }
};