import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUnitName } from "../../api/helper";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import {
  fetchInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  fetchInventoryStats,
} from "../../api/api";
import InventoryForm from "../../components/FormComponent/InventoryForm";
import DeleteConfirmation from "../../components/FormComponent/DeleteConfirmation";
import DashboardDetails from "../../components/DashboardDetails/DashboardDetails";
import LowInventory from "../../components/FormComponent/LowInventory";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [inventoryStats, setInventoryStats] = useState({ totalLowStock: 0 });
  const [totalinventory, settotalInventory] = useState({ totalInventory: 0 });
  const role = localStorage.getItem("role");
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showLowInventoryForm, setShowLowInventoryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    reorder_level: "",
    price: "",
    unit_id: "",
  });
  const [updateData, setUpdateData] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    reorder_level: "",
    price: "",
    unit_id: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to be logged in to access this page.");
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
      return;
    }

    const getInventory = async () => {
      try {
        const data = await fetchInventory(token);
        setInventoryData(data);
      } catch (error) {
        toast.error("Failed to fetch inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const getInventoryStats = async () => {
      try {
        const stats = await fetchInventoryStats(token);
        setInventoryStats(stats.low_inventory_count);
        settotalInventory(stats.total_inventory);
      } catch (error) {
        toast.error("Failed to fetch inventory stats. Please try again.");
      } finally {
        setLoadingStats(false);
      }
    };

    getInventory();
    getInventoryStats();

    const loaderTimeout = setTimeout(() => {
      setLoading(false);
      setLoadingStats(false);
    }, 5500);

    return () => clearTimeout(loaderTimeout);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, unit_id: value });
  };

  const handleUpdateSelectChange = (value) => {
    setUpdateData({ ...updateData, unit_id: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await createInventory(formData, token);
      toast.success("Inventory item created successfully!");
      setShowForm(false);
      setInventoryData((prevData) => [...prevData, response.data]);
      setFormData({
        name: "",
        description: "",
        quantity: "",
        reorder_level: "",
        price: "",
        unit_id: "",
      });
      const updatedStats = await fetchInventoryStats(token);
      setInventoryStats(updatedStats.low_inventory_count);
      settotalInventory(updatedStats.total_inventory);
    } catch (error) {
      console.error("Error creating inventory:", error);
      toast.error("Failed to create inventory item. Please try again.");
    }
  };

  const openUpdateForm = (item) => {
    setUpdateData(item);
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await updateInventory(updateData.id, updateData, token);
      toast.success("Inventory item updated successfully!");
      setInventoryData((prevData) =>
        prevData.map((item) =>
          item.id === updateData.id ? response.data : item,
        ),
      );
      setShowUpdateForm(false);
      setUpdateData({
        id: "",
        name: "",
        description: "",
        quantity: "",
        reorder_level: "",
        price: "",
        unit_id: "",
      });
      const updatedStats = await fetchInventoryStats(token);
      setInventoryStats(updatedStats.low_inventory_count);
      settotalInventory(updatedStats.total_inventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory item. Please try again.");
      setUpdateData({
        id: "",
        name: "",
        description: "",
        quantity: "",
        reorder_level: "",
        price: "",
        unit_id: "",
      });
      setShowUpdateForm(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!itemToDelete) return;

    try {
      await deleteInventory(itemToDelete.id, token);
      toast.success("Inventory item deleted successfully!");
      setInventoryData((prevData) =>
        prevData.filter((item) => item.id !== itemToDelete.id),
      );
      setShowDeleteConfirm(false);
      const updatedStats = await fetchInventoryStats(token);
      setInventoryStats(updatedStats.low_inventory_count);
      settotalInventory(updatedStats.total_inventory);
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error("Failed to delete inventory item. Please try again.");
      setShowDeleteConfirm(false);
    }
  };

  const openDeleteConfirm = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  if (loading || loadingStats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const columns = [
    { name: "Unit Name", uid: "unit_name" },
    { name: "Name", uid: "name" },
    { name: "Description", uid: "description" },
    { name: "Quantity", uid: "quantity" },
    { name: "Status", uid: "status" },
    { name: "Price", uid: "price" },
    { name: "Actions", uid: "actions" },
  ];

  const statusColorMap = {
    low: "danger",
    medium: "warning",
    high: "success",
  };

  const getStatus = (reorder_level) => {
    if (reorder_level < 10) return "low";
    if (reorder_level < 50) return "medium";
    return "high";
  };

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "unit_name":
        return getUnitName(item.unit_id);
      case "status":
        const status = getStatus(item.reorder_level);
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[status]}
            size="sm"
            variant="flat"
          >
            {status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit item">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => openUpdateForm(item)}
              >
                <FaEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete item">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => openDeleteConfirm(item)}
              >
                <FaTrash />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const summaryData = [
    {
      title: "Total Inventory",
      value: totalinventory,
    },
    {
      title: "Total Low Stock Items",
      value: inventoryStats,
    },
  ];

  return (
    <div className="min-h-screen flex px-4 py-2 lg:px-8 lg:py-4">
      <div className="w-full md:w-[75%] ml-[20%] p-8 overflow-y-auto">
        <DashboardDetails
          title={`MaxHelp Business ${role !== "admin" ? "Employee" : "Admin"} - Dashboard`}
          subtitle="Inventory Details Page and Statistics"
          summaryData={summaryData}
        />
        <div className="grid grid-cols-1 gap-8 mt-[2rem]">
          <Card className="h-full w-full shadow-none">
            <div className="flex items-center justify-between p-2">
              <div className="left">
                <h5 className="text-blue-gray-700 mb-4 text-left">
                  Inventory List
                </h5>
              </div>

              {role === "admin" && (
                <div className="">
                  <div className="flex justify-end mb-6">
                    <Button onClick={() => setShowForm(true)} color="success">
                      Create Item
                    </Button>
                  </div>
                </div>
              )}
              {role === "employee" && (
                <div className="right absolute right-[-15%] md:right-[-70%]">
                  <div className="flex justify-end mb-6">
                    <Button
                      onClick={() => setShowLowInventoryForm(true)}
                      color="success"
                      className="mb-4"
                    >
                      Report Low Inventory
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {showForm && (
              <InventoryForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onClose={() => setShowForm(false)}
                title="Create New Inventory Item"
              />
            )}

            {showUpdateForm && (
              <InventoryForm
                formData={updateData}
                setFormData={setUpdateData}
                onSubmit={handleUpdateSubmit}
                onClose={() => setShowUpdateForm(false)}
                title="Update Inventory Item"
                isUpdate
              />
            )}

            {showLowInventoryForm && (
              <LowInventory
                onClose={() => setShowLowInventoryForm(false)}
                onSuccess={() =>
                  toast.success("Low inventory reported successfully")
                }
                onError={() => toast.error("Failed to report low inventory")}
              />
            )}

            <DeleteConfirmation
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onDelete={handleDelete}
            />

            <Table aria-label="Inventory table">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={inventoryData}>
                {(item, index) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell({ ...item, index }, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
