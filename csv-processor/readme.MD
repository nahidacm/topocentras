### Process CSV file

To convert the provided CSV to Magento 2 format, run the following command:

`node process-csv.js <input_file> <start_row> <end_row> [download_images]`

```bash
node process-csv.js saltibarsciu-festivalis-fb.csv 1 1000 download_images
```

`download_images` is an optional argument that indicates whether to download images or not.

The resulting output file will be named `output_file.csv`.

The resulting ignored file will be named `ignored.csv`.

The resulting advanced price file will be named `advanced_price.csv`.

The image downloads will be saved in the `./downloads` directory.

Total number of rows in provided file: 102379

### Import to Magento 2

- Move downloaded images to `<magento_root>/var/import/images/product_images`.
- In import settings, set the image directory to `product_images`.
- Import `output_file.csv` for product import.
- Import `advanced_price.csv` for product import.

### Notes of Submission

Set stock management to "No"
Considered as category: custom_label_0
For presentation purposes, all categories are set under "Default Category/All Categories".

For sake of simplicity, ignored follwing columns:

- sale_price
- brand
