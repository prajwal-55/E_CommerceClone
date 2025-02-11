import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout/Layout";
// import AdminMenu from "./../../components/Layout/AdminMenu";
import AdminMenu from "../../../components/Layout/AdminMenu/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../../components/Form/CategoryForm/CategoryForm";
import { Modal } from "antd";
import "./CreateCategory.css"
const CreateCategory = () => {
  const [categories, setCategories] = useState([]); // there will be multiple values for the we are using array
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,  // we are seding this name to the backend
      });
      if (data?.success) {
        toast.success(`${name} is created`); 
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category"); // using axios we are sending network request of get
      if (data?.success) {
        setCategories(data?.category); // we are gettgin category from backend name should be same 
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pId}` // in backend it will be taken as  .../delete-category/:id
      );
      if (data.success) {
        toast.success(`category is deleted`);

        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="ctg-title">Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit} // we are sending these values to CategoryForm as a props
                value={name} // we are sending name as a value in categoryForm
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr >
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr className="ctg-item">
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="cclf-btns ccedit-btn"
                            onClick={() => {
                              setVisible(true); // if we set it is true then model component from antd design will pop up
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="cclf-btns"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal // this model is taken from ant design
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
