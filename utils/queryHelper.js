const productUpdateQuery = (req, type) => {
  const { phone, id } = req.params;

  const product_picture_1 = req.files[0] && req.files[0].filename;
  const product_picture_2 = req.files[1] && req.files[1].filename;

  const fieldsName = req.files.map((item) => item.fieldname);

  const { product_name, category, price, delivery_day, short_desc } = req.body;

  const query =
    type === 'upload'
      ? // this is upload query
        `INSERT INTO admin_products (queen_phone, product_name, category, ${
          fieldsName.includes('product_picture_1') && 'product_picture_1'
        }, ${
          fieldsName.includes('product_picture_2') && 'product_picture_2'
        }, price, delivery_day, short_desc) VALUES('${phone}', '${product_name}', '${category}', '${product_picture_1}', '${product_picture_2}', '${price}', '${delivery_day}', '${short_desc}')`
      : type === 'update'
      ? // this is update query
        `UPDATE admin_products SET product_name = '${product_name}', category = '${category}', ${
          fieldsName.includes('product_picture_1') &&
          `product_picture_1 = '${product_picture_1}'`
        }, ${
          fieldsName.includes('product_picture_2') &&
          `product_picture_2 = '${product_picture_2 || product_picture_1}'`
        }, price = '${price}', delivery_day = '${delivery_day}', short_desc = '${short_desc}' WHERE id = ${id}`
      : null;

  return query.replace(/[']*(false|undefined)[']*[,]*/gi, '');
};

module.exports = productUpdateQuery;
