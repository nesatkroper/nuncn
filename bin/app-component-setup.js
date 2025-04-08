import degit from "degit";

export const appComponentSetup = async (targetDir, spinner) => {
    try {
        spinner.text = "Downloading components...";
        const emitter = degit("nesatkroper/own-components/components", {
            force: true,
        });
        await emitter.clone(targetDir);
    } catch (error) {
        throw new Error(`Failed to download components: ${error.message}`);
    }
};