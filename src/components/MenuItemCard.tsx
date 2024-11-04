import React from "react";
import { Typography, Box, Tooltip } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export interface ProductOption {
  id: string;
  label: string;
  price: number;
  description?: string;
  batchSales?: {
    quantity: number;
    batchPrice: number;
  };
}

const ProductOptionCard: React.FC<ProductOption> = ({
  id,
  label,
  price,
  description,
  batchSales,
}) => {
  // this will interact with the central store like redux
  const handleAddItem = (id: string) => {};
  return (
    <Box key={id} sx={{ px: 3, py: { xs: 2, md: 2.5 }, boxShadow: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          onClick={() => handleAddItem(id)}
          sx={{
            display: "flex",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <AddShoppingCartIcon style={{ width: 16, height: 16 }} />

          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: "bold", paddingLeft: 1 }}>
          &#8364;{price.toFixed(2)}
        </Typography>
      </Box>
      {description && (
        <Tooltip arrow title={description}>
          <Typography
            noWrap
            sx={{ mt: 1, overflow: "hidden", textOverflow: "ellipsis" }}
            variant="body2"
            color="textSecondary"
          >
            {description}
          </Typography>
        </Tooltip>
      )}
      {batchSales && (
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            fontWeight: "bold",
            display: "inline-block",
            backgroundColor: "grey.300",
            p: 1,
            lineHeight: "100%",
            borderRadius: 2,
          }}
        >
          {`${batchSales.quantity} x ${label} for `} &#8364;
          {`${batchSales.batchPrice.toFixed(2)}`}
        </Typography>
      )}
    </Box>
  );
};

export default ProductOptionCard;
