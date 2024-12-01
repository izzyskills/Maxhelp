import React from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

const InventoryForm = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  title,
  isUpdate = false,
}) => {
  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, unit_id: value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 gap-5">
      <Card color="white" shadow={5} className="w-full max-w-md p-6 ">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          {title}
        </Typography>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Input
            label="Item Name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            isRequired
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            name="description"
            isRequired
          />
          <Input
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            name="quantity"
            isRequired
          />
          <Input
            label="Reorder Level"
            type="number"
            value={formData.reorder_level}
            onChange={handleInputChange}
            name="reorder_level"
            isRequired
          />
          <Input
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            name="price"
            isRequired
          />

          <Select
            label="Unit Name"
            value={formData.unit_id}
            onChange={handleSelectChange}
            isRequired
          >
            <SelectItem value="1">Restaurant</SelectItem>
            <SelectItem value="2">Grocery Store</SelectItem>
            <SelectItem value="3">Bottled Water Industry</SelectItem>
            <SelectItem value="4">Bookshop</SelectItem>
          </Select>

          <div className="flex justify-between gap-4 mt-5">
            <Button type="submit" color="blue" className="mt-2">
              {isUpdate ? "Update Item" : "Create Item"}
            </Button>

            <Button onClick={onClose} color="red" className="mt-2">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InventoryForm;
