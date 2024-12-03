import React, { useEffect, useState } from "react";
import { getUnitName } from "../../api/helper";
import { Bar } from "react-chartjs-2";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Tooltip,
  ArcElement,
  Legend,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  createEmployee,
  listEmployees,
  deleteEmployee,
  updateEmployee,
} from "../../api/api"; // Import the API function
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeForm from "../../components/FormComponent/EmployeeForm";
import DeleteConfirmation from "../../components/FormComponent/DeleteConfirmation";
import DashboardDetails from "../../components/DashboardDetails/DashboardDetails";
import Loader from "../../components/Loader/Loader";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip as NextUITooltip,
} from "@nextui-org/react";

// Register necessary chart elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Employee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [unitCounts, setUnitCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    unit_id: "",
    gender: "",
    password: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [unitChartData, setUnitChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Employees",
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to be logged in to access this page.");
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    }

    const fetchEmployees = async () => {
      setLoading(true); // Show loader
      try {
        const response = await listEmployees(token);
        const employeeList = response?.data || [];
        console.log(employeeList);
        console.log(response);

        setEmployees(employeeList);

        const unitCountMap = employeeList.reduce((acc, emp) => {
          const unitName = getUnitName(emp.unit_id);
          acc[unitName] = (acc[unitName] || 0) + 1;
          return acc;
        }, {});

        setUnitCounts(unitCountMap);

        const colors = [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ];

        setUnitChartData({
          labels: Object.keys(unitCountMap),
          datasets: [
            {
              label: "Number of Employees",
              data: Object.values(unitCountMap),
              backgroundColor: colors,
              hoverBackgroundColor: colors,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Error fetching employees");
      } finally {
        setLoading(false); // Hide loader after fetch
      }
    };

    setLoading(true);

    // Simulate a loading time of 2 seconds
    setTimeout(() => {
      fetchEmployees();
    }, 1500);
  }, [navigate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      // If editing an employee, update it, else create a new employee
      let response;
      if (employeeToEdit) {
        // Update existing employee
        response = await updateEmployee(employeeToEdit.id, formData, token); // Use employeeToEdit.id
        const updatedEmployee = response.data;

        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === updatedEmployee.id
              ? { ...emp, ...updatedEmployee }
              : emp,
          ),
        );
        toast.success("Employee updated successfully");
      } else {
        // Create new employee
        response = await createEmployee(formData, token);
        const newEmployee = response.data;

        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
        toast.success("Employee created successfully");
      }

      const unitName = getUnitName(response.data.unit_id);
      const newUnitCounts = {
        ...unitCounts,
        [unitName]: (unitCounts[unitName] || 0) + 1,
      };

      setUnitCounts(newUnitCounts);
      setUnitChartData({
        labels: Object.keys(newUnitCounts),
        datasets: [
          {
            label: "Number of Employees",
            data: Object.values(newUnitCounts),
            backgroundColor: Object.keys(newUnitCounts).map(
              (_, index) => colors[index % colors.length],
            ),
            hoverBackgroundColor: Object.keys(newUnitCounts).map(
              (_, index) => colors[index % colors.length],
            ),
          },
        ],
      });
    } catch (error) {
      console.error("Error submitting employee:", error);
      toast.error("Error processing employee");
    } finally {
      setLoading(false); // Hide loader after the operation
      handleCancel(); // Reset form after submission
    }
  };

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee); // Ensure this is not null
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      unit_id: employee.unit_id,
      gender: employee.gender,
      password: "",
    });
    setShowUpdateForm(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteEmployee(employeeToDelete, token);
      toast.success("Employee deleted successfully");

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeToDelete),
      );

      const deletedEmployee = employees.find(
        (emp) => emp.id === employeeToDelete,
      );
      if (deletedEmployee) {
        const unitName = getUnitName(deletedEmployee.unit_id);
        const newUnitCounts = {
          ...unitCounts,
          [unitName]: unitCounts[unitName] - 1,
        };

        setUnitCounts(newUnitCounts);
        setUnitChartData({
          labels: Object.keys(newUnitCounts),
          datasets: [
            {
              label: "Number of Employees",
              data: Object.values(newUnitCounts),
              backgroundColor: Object.keys(newUnitCounts).map(
                (_, index) => colors[index % colors.length],
              ),
              hoverBackgroundColor: Object.keys(newUnitCounts).map(
                (_, index) => colors[index % colors.length],
              ),
            },
          ],
        });
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      unit_id: "",
      gender: "",
    });
    setShowForm(false);
    setShowUpdateForm(false);
    setEmployeeToEdit(null);
  };

  const columns = [
    { name: "Name", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Role", uid: "role" },
    { name: "Gender", uid: "gender" },
    { name: "Unit Name", uid: "unit_name" },
    { name: "Actions", uid: "actions" },
  ];

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "unit_name":
        return getUnitName(item.unit_id);
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <NextUITooltip content="Edit employee">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditEmployee(item)}
              >
                <FaEdit />
              </span>
            </NextUITooltip>
            <NextUITooltip color="danger" content="Delete employee">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteEmployee(item.id)}
              >
                <FaTrash />
              </span>
            </NextUITooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const summaryData = [
    {
      title: "Total Male Employees",
      value: employees.filter((emp) => emp.gender === "Male").length,
    },
    {
      title: "Total Female Employees",
      value: employees.filter((emp) => emp.gender === "Female").length,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex px-4 py-2 lg:px-8 lg:py-4">
      <div className="w-full md:w-[75%] ml-[20%] p-8 overflow-y-auto">
        {/* Employee Table */}
        <DashboardDetails
          title="MaxHelp Business Admin - Dashboard"
          subtitle="Employee Details Page and Statistics"
          summaryData={summaryData}
        />
        <div className="grid grid-cols-1 gap-8 mt-[2rem]">
          <Card className="h-full w-full shadow-none relative">
            <div className="flex items-center justify-between p-2">
              <h5 className="text-blue-gray mb-4 text-left">Employee List</h5>

              <div className="">
                <div className="flex justify-end mb-6">
                  <Button onClick={() => setShowForm(true)} color="success">
                    Create Employee
                  </Button>
                </div>
              </div>
            </div>

            <Table aria-label="Employee table">
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
              <TableBody items={employees}>
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

        {/* Bar Chart for Employee Unit Distribution */}
        <div className="flex items-start justify-center mt-[2rem]">
          <Card className="flex flex-col items-center p-6 w-full">
            <h5 className="text-blue-gray mb-4">Employee Unit Distribution</h5>
            <Bar
              data={unitChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Unit Name",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Employees",
                    },
                    beginAtZero: true,
                  },
                },
              }}
              className="h-[100%] w-[100%]"
            />
          </Card>
        </div>

        {/* Popup Form */}
        {showForm && (
          <EmployeeForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onClose={handleCancel}
            title="Create New Employee"
            submitButtonText="Submit"
          />
        )}

        {/* Delete Confirmation */}
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onDelete={confirmDelete}
        />
      </div>
    </div>
  );
};

export default Employee;
