const fs = require("fs");
const path = require("path");
const axios = require("axios");
const readline = require("readline");
const pLimit = require("p-limit").default;

const INPUT_FILE = "images.csv";
const BASE_DIR = "./downloads";
const CONCURRENCY = 5; // adjust based on server power

const limit = pLimit(CONCURRENCY);

// Extract clean media path
function extractMediaPath(url) {
    try {
        const parsed = new URL(url);

        const mediaIndex = parsed.pathname.indexOf("/media/");
        if (mediaIndex === -1) return null;

        return parsed.pathname.substring(mediaIndex);
        // example: /media/catalog/product/t/o/file.jpg
    } catch {
        return null;
    }
}

// Download single image
async function downloadImage(url) {
    const mediaPath = extractMediaPath(url);
    if (!mediaPath) {
        console.log("Skipping (invalid path):", url);
        return;
    }

    const filePath = path.join(BASE_DIR, mediaPath);
    const dir = path.dirname(filePath);

    try {
        await fs.promises.mkdir(dir, { recursive: true });

        const response = await axios({
            method: "GET",
            url,
            responseType: "stream",
            timeout: 10000,
            validateStatus: status => status >= 200 && status < 300
        });

        // Validate content-type
        const contentType = response.headers["content-type"];
        if (!contentType || !contentType.startsWith("image/")) {
            console.log("Skipping (not image):", url);
            return;
        }

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log("Downloaded:", mediaPath);

    } catch (err) {
        console.log("Failed:", url);
    }
}

// Process file line by line
async function processFile() {
    const rl = readline.createInterface({
        input: fs.createReadStream(INPUT_FILE),
        crlfDelay: Infinity
    });

    const tasks = [];

    for await (const line of rl) {
        const url = line.trim();
        if (!url) continue;

        tasks.push(limit(() => downloadImage(url)));
    }

    await Promise.all(tasks);
    console.log("All done.");
}

processFile();