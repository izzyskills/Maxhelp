import React, { useEffect, useState } from "react";
import { getUnitName } from "../../api/helper";
import { Bar, Pie } from "react-chartjs-2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { Tooltip, ArcElement, Legend, Chart as ChartJS } from "chart.js";
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
ChartJS.register(ArcElement, Tooltip, Legend);

const Employee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
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
  const [genderChartData, setGenderChartData] = useState({
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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

        const maleCount = employeeList.filter(
          (emp) => emp.gender === "Male",
        ).length;
        const femaleCount = employeeList.filter(
          (emp) => emp.gender === "Female",
        ).length;
        setGenderCounts({ male: maleCount, female: femaleCount });

        setGenderChartData({
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [maleCount, femaleCount],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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

      const newGenderCounts = {
        male:
          response.data.gender === "Male"
            ? genderCounts.male + 1
            : genderCounts.male,
        female:
          response.data.gender === "Female"
            ? genderCounts.female + 1
            : genderCounts.female,
      };

      setGenderCounts(newGenderCounts);
      setGenderChartData({
        labels: ["Male", "Female"],
        datasets: [
          {
            data: [newGenderCounts.male, newGenderCounts.female],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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
        setGenderCounts((prevCounts) => ({
          male:
            deletedEmployee.gender === "Male"
              ? prevCounts.male - 1
              : prevCounts.male,
          female:
            deletedEmployee.gender === "Female"
              ? prevCounts.female - 1
              : prevCounts.female,
        }));

        setGenderChartData({
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [genderCounts.male, genderCounts.female],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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
    { name: "S/N", uid: "sn" },
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
      case "sn":
        return item.index + 1;
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
      value: genderCounts.male,
    },
    {
      title: "Total Female Employees",
      value: genderCounts.female,
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
        {/* Pie Chart for Employee Gender */}

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

        {/* Employee Table */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-[2rem]">
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
        <div className="flex items-start justify-center mt-[2rem]">
          <Card
            color="transparent"
            shadow={2}
            className="flex flex-col items-center p-6"
          >
            <h5 className="text-blue-gray mb-4">
              Employee Gender Distribution
            </h5>
            <Bar
              data={genderChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
              className="h-[50%] w-[50%]"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Employee;
