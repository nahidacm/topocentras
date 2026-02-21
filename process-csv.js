const fs = require("fs");
const csv = require("csv-parser");
const { stringify } = require("csv-stringify");

const path = require("path");
const axios = require("axios");
const BASE_DIR = "./downloads";

// =======================
// CLI ARGUMENTS
// =======================
const inputFile = process.argv[2];
const startRow = parseInt(process.argv[3], 10);
const endRow = parseInt(process.argv[4], 10);
const imageDownload = process.argv[5] === "download_images";

if (!inputFile || isNaN(startRow) || isNaN(endRow)) {
    console.error("Usage: node process.js input.csv startRow endRow");
    process.exit(1);
}

// =======================
// CONSTANTS
// =======================
const BASE_URL = "https://www.topocentras.lt/";
const IMAGE_PREFIX =
    "https://picfit.topocentras.lt/xcdn-cgi/image/fit=contain,quality=85,format=auto/media/catalog/product/";

const EXPECTED_COLUMNS = [
    "id", "title", "description", "price", "member_price", "link", "image_link",
    "condition", "availability", "sale_price", "brand",
    "custom_label_0", "custom_label_1"
];

const OUTPUT_COLUMNS = [
    "sku", "product_type", "attribute_set_code", "name", "description", "price",
    "group_price_customer_group", "group_price", "product_websites",
    "product_online", "visibility", "is_in_stock", "categories", "base_image", "small_image", "thumbnail_image"
];

const ADVANCED_PRICE_COLUMNS = [
    "sku",
    "tier_price_website",
    "tier_price_customer_group",
    "tier_price_qty",
    "tier_price",
    "tier_price_value_type"
];

// =======================
// HELPERS
// =======================

const isFloatEUR = (val) => /^\s*\d+(\.\d+)?\s*EUR\s*$/.test(val);

const removeEUR = (val) =>
    val.replace("EUR", "").trim();

const isValidNumber = (val) =>
    !isNaN(val) && val !== "";

// =======================
// OUTPUT STREAMS
// =======================
const outputStream = stringify({ header: true, columns: OUTPUT_COLUMNS });
outputStream.pipe(fs.createWriteStream("output_file.csv"));

const ignoredStream = stringify({ header: true, columns: ["row_number", "reason"] });
ignoredStream.pipe(fs.createWriteStream("ignored.csv"));

const advancedPriceStream = stringify({ header: true, columns: ADVANCED_PRICE_COLUMNS });
advancedPriceStream.pipe(fs.createWriteStream("advanced_price.csv"));

// =======================
// PROCESSING
// =======================
let currentRow = 0;

fs.createReadStream(inputFile)
    .pipe(csv())
    .on("headers", (headers) => {
        if (headers.length !== 13) {
            console.error("Header column count mismatch.");
            process.exit(1);
        }

        for (let col of EXPECTED_COLUMNS) {
            if (!headers.includes(col)) {
                console.error(`Missing required column: ${col}`);
                process.exit(1);
            }
        }
    })
    .on("data", (row) => {
        currentRow++;

        if (currentRow < startRow || currentRow > endRow) return;

        const rowNum = currentRow;

        console.log(`Processing row: ${currentRow}`);

        // ================= VALIDATION =================
        let reason = "";

        if (!isValidNumber(row.id)) reason = "Invalid id";
        else if (!row.title?.trim()) reason = "Empty title";
        else if (!row.description?.trim()) reason = "Empty description";
        else if (!isFloatEUR(row.price)) reason = "Invalid price";
        else if (row.member_price && !isFloatEUR(row.member_price))
            reason = "Invalid member_price";
        else if (!row.link?.startsWith(BASE_URL) || !row.link.endsWith(".html"))
            reason = "Invalid link";
        else if (!row.image_link?.startsWith(IMAGE_PREFIX))
            reason = "Invalid image_link";
        else if (row.sale_price?.trim() && !isFloatEUR(row.sale_price))
            reason = "Invalid sale_price";
        else if (!isValidNumber(row.custom_label_1))
            reason = "Invalid custom_label_1";

        if (reason) {
            ignoredStream.write({ row_number: rowNum, reason });
            console.log(`Ignored row: ${rowNum}, reason: ${reason}`);
            return;
        }

        // ================= TRANSFORM =================

        const price = removeEUR(row.price);
        const memberPrice = row.member_price ? removeEUR(row.member_price) : null;

        let groupPrice = "";
        if (row.member_price) {
            groupPrice = removeEUR(row.member_price);
        }

        const isInStock =
            row.availability?.toLowerCase() === "in stock" ? 1 : 0;

        const urlKey = row.link
            .replace(BASE_URL, "")
            .replace(".html", "");

        const baseImage = row.image_link.replace(IMAGE_PREFIX, "");

        const cleanCustomLabel0 = row.custom_label_0
            ? row.custom_label_0.replace(/[^a-zA-Z0-9]/g, "")
            : "";
        const category = "Default Category/" + (cleanCustomLabel0 || "");

        // ================= OUTPUT ROW =================

        outputStream.write({
            sku: row.id,
            product_type: "simple",
            attribute_set_code: "Default",
            name: row.title,
            description: row.description,
            price: price,
            group_price_customer_group: groupPrice ? "Topo Klubas" : "",
            group_price: groupPrice,
            product_websites: "base",
            product_online: 1,
            visibility: "Catalog, Search",
            is_in_stock: isInStock,
            categories: category,
            base_image: baseImage,
            small_image: baseImage,
            thumbnail_image: baseImage
        });

        // ================= ADVANCED PRICE =================
        if (memberPrice) {
            advancedPriceStream.write({
                sku: row.id,
                tier_price_website: "All Websites [EUR]",
                tier_price_customer_group: "Topo Klubas",
                tier_price_qty: 1,
                tier_price: memberPrice,
                tier_price_value_type: "Fixed"
            });
        }


        // ================= IMAGE DOWNLOAD (OPTIONAL) =================
        if (imageDownload) {
            downloadImage(row.image_link);
        }
    })
    .on("end", () => {
        outputStream.end();
        ignoredStream.end();
        advancedPriceStream.end();
        console.log("Processing completed.");
    })
    .on("error", (err) => {
        console.error("Error:", err.message);
    });


// ======================
// IMAGE DOWNLOADING (OPTIONAL)

// Extract clean media path
function extractMediaPath(url) {
    try {
        const parsed = new URL(url);

        const stringkey = "/media/catalog/product/";
        const mediaIndex = parsed.pathname.indexOf(stringkey);
        if (mediaIndex === -1) return null;

        return parsed.pathname.substring(mediaIndex + stringkey.length);
    } catch (err) {
        console.error("Error:", err.message);
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