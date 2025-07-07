import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form } from "antd";
import { useUserStore } from "../store/userStore";

const UserTable = () => {
  const {
    users,
    fetchUsers,
    deleteUser,
    addUser,
    updateUser,
    searchQuery,
    setSearchQuery,
  } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [form] = Form.useForm();
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingUser) {
          updateUser(editingUser.id, values);
        } else {
          console.log("Yangi user:", values);
          addUser(values);
        }
        setIsModalOpen(false);
        form.resetFields();
        setEditingUser(null);
      })
      .catch((err) => console.error("Formda xato:", err));
  };

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-5">
        <Input.Search
          className="!w-[500px]"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          className="!font-bold"
          onClick={() => setIsModalOpen(true)}
        >
          Add User
        </Button>
      </div>
      <Table
        dataSource={filteredUsers}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Actions",
            render: (_, record) => (
              <div className="flex gap-[10px]">
                <Button
                  className="!bg-yellow-600 !text-white w-[80px] !font-bold"
                  onClick={() => handleEdit(record)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Button
                  className="!bg-red-600 !text-white w-[80px] !font-bold"
                  danger
                  onClick={() => deleteUser(record.id)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTable;
