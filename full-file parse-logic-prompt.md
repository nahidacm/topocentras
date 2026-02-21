Write nodejs code to process a csv file.
Row validation rule:

1. Number of columns should be 13
2. Column names should be "id","title","description","price","member_price","link","image_link","condition","availability","sale_price","price","brand","member_price","custom_label_0","custom_label_1"

Column validation rule:

1. "id" column should be a number
2. "title" column should be a string, not empty
3. "description" column should be a string, not empty
4. "price" column should be a float number with trailing "EUR"
5. "member_price" column should be a a float number with trailing "EUR" or empty
6. "link" column should be a string that start with "https://www.topocentras.lt/" and end with ".html", not empty
7. "image_link" column should be a string that start with "https://picfit.topocentras.lt/xcdn-cgi/image/fit=contain,quality=85,format=auto/", not empty
8. "condition" column should be a string
9. "availability" column should be a string
10. "sale_price" column should be a float number with trailing "EUR"
11. "brand" column should be a string
12. "custom_label_0" column should be a string
13. "custom_label_1" column should be a number

The input file may have 20000 rows. So you can't read the whole file into memory. or write the whole file into memory.
Take start and end row numbers as input.
If validation fails then output the reason with row number in the ignored.csv file. else output the processed data in output_file.csv.
Remove "EUR" from the end of the "price" column. and trim the "price" column.
Remove "EUR" from the end of the "sale_price" column. and trim the "group_price" column.
If "availability" column is "in stock" then set "is_in_stock" column to 1 else 0.
If "member_price" column is empty then keep group_price_customer_group and "group_price" column empty too.
Remove base url and ".html" from "link" column. base url is "https://www.topocentras.lt/"
Remove https://picfit.topocentras.lt/xcdn-cgi/image/fit=contain,quality=85,format=auto/ from "image_link" column

keep following columns in output file:
sku,product_type,attribute_set_code,name,price,group_price_customer_group,group_price,product_online,visibility,qty,is_in_stock,base_image

Default values for columns:
product_type:simple
attribute_set_code:Default,Test Product,100,1,4,10,1,""
product_online:1
visibility:4
qty:1000
group_price_customer_group:Topo Klubas

Field mapping input_file -> output_file:
id -> sku
title -> name
description -> description
price -> price
member_price -> group_price
link -> url_key
image_link -> base_image,small_image,thumbnail_image,additional_images
availability -> is_in_stock
