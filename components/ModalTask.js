"use client";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "@/app/page.module.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ModalTask = ({
  show,
  setModalShow,
  refreshDatas,
  taskToEdit,
  setAllDatas,
  setSearchStatus,
  setQuery,
  setQueryDatas,
}) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [validate, setValidate] = useState(true);

  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.name);
      setDescription(taskToEdit.description);
      console.log(taskToEdit);
    } else {
      setTaskName("");
      setDescription("");
    }
  }, [taskToEdit]);

  const handleClose = () => {
    setTaskName("");
    setDescription("");
    setValidate(true);
    setModalShow(false);
  };

  const handleSave = async () => {
    if (taskName === "") {
      setValidate(false);
      return;
    }
    setValidate(true);
    const now = new Date().toISOString();
    try {
      let url = "https://wayi.league-funny.com/api/task";
      let method, body;
      if (taskToEdit) {
        url = `https://wayi.league-funny.com/api/task/${taskToEdit.id}`;
        method = "PUT";
        body = {
          id: taskToEdit.id,
          name: taskName,
          description: description,
          created_at: taskToEdit.created_at,
          updated_at: now,
        };
      } else {
        const respone = await fetch(url);
        const result = await respone.json();
        const datas = result.data;
        const maxId = datas.reduce(
          (max, data) => (max > data.id ? max : data.id),
          datas[0].id
        );
        const newTaskId = maxId + 1;
        body = {
          id: newTaskId,
          name: taskName,
          description: description,
          is_completed: false,
          created_at: now,
          updated_at: now,
        };
        method = "POST";
      }
      const saveReponse = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (saveReponse.ok) {
        const updateTask = await saveReponse.json();
        toast.success(taskToEdit ? "編輯成功！" : "新增成功");
        handleClose();
        setAllDatas((prevDatas) => {
          const updatedData = [
            updateTask,
            ...prevDatas.filter((data) => data.id !== updateTask.id),
          ];
          updatedData.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );
          return updatedData;
        });
        setQuery("");
        setQueryDatas([]);
        setSearchStatus(false);
        refreshDatas();
      } else {
        throw new Error("儲存失敗");
      }
    } catch (error) {
      toast.error(taskToEdit ? "編輯任務錯誤！" : "新增任務錯誤！");
      console.error(taskToEdit ? "編輯任務失敗" : "新增任務失敗", error);
    }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      className="text-black"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {taskToEdit ? "EDIT TASK" : "NEW TASK"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="my-2">
          <label htmlFor="taskTitle" className="form-label">
            任務名稱
          </label>
          <input
            type="text"
            id="taskTitle"
            name="name"
            className={`form-control ${!validate ? "is-invalid" : ""}`}
            aria-describedby="taskTitleHelpBlock"
            maxLength={10}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          {!validate && (
            <div id="taskTitleHelpBlock" className="invalid-feedback">
              請務必輸入任務標題！
            </div>
          )}
        </div>
        <div>
          <div className="form-floating">
            <textarea
              className={`form-control ${styles.textarea}`}
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              name="description"
              style={{ height: 100 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={30}
            />
            <label htmlFor="floatingTextarea2">任務描述</label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSave}>
          儲存
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTask;
