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
