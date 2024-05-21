"use client";

import styles from "@/app/page.module.css";
import { IoMdTime, IoIosMore } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

const TaskCard = ({
  datas,
  handleIsCompleteChange,
  setTaskToEdit,
  setModalShow,
  itemsPerPage,
  refreshDatas,
}) => {
  const handleEdit = async (id) => {
    try {
      const initUrl = "https://wayi.league-funny.com/api/task?page=1";
      const initResponse = await fetch(initUrl);
      const initResult = await initResponse.json();
      const total = initResult.total;
      const totalPages = Math.ceil(total / itemsPerPage);
      let allData = initResult.data;
      for (let page = 2; page <= totalPages; page++) {
        const url = `https://wayi.league-funny.com/api/task?page=${page}`;
        const response = await fetch(url);
        const result = await response.json();
        allData = [...allData, ...result.data];
      }
      const editData = allData.find((data) => data.id === id);
      setTaskToEdit(editData);
      setModalShow(true);
    } catch (error) {
      console.error("取得編輯資料錯誤", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `https://wayi.league-funny.com/api/task/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("刪除成功！");
        refreshDatas();
      } else {
        throw new Error("刪除失敗");
      }
    } catch (error) {
      console.error("刪除數據錯誤", error);
      toast.error("刪除失敗，請稍後再試。");
    }
  };

  const handleCheckboxChange = (id, currentStatus) => {
    const newStatus = !currentStatus;
    handleIsCompleteChange(id, newStatus);
  };

  const formatDate = (str) => {
    const date = new Date(str);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "yyyy.MM.dd HH:mm:ss");
  };
  return (
    <>
      {datas.map((data) => (
        <>
          <div className={`row ${styles.todolist}`} key={data.id}>
            <div className="form-check col-2 col-md-1 d-flex justify-content-center">
              <input
                className={`form-check-input ${styles.checkbox}`}
                type="checkbox"
                id="flexCheckDefault"
                checked={data.is_completed}
                onChange={() => {
                  handleCheckboxChange(data.id, data.is_completed);
                }}
              />
            </div>
            <div className={`col-10 col-md-5 ${styles.taskContent}`}>
              <div className={styles.title}>{data.name}</div>
              <div className={styles.description}>{data.description}</div>
              <div className={styles.createdTime}>
                <IoMdTime className="me-2" />
                {formatDate(data.created_at)}
              </div>
              {data.updated_at &&
                new Date(data.updated_at) > new Date(data.created_at) && (
                  <div className={styles.updateTime}>
                    <span>更新時間：</span>
                    {formatDate(data.updated_at)}
                  </div>
                )}
            </div>
            <div className="col-6 col-md-2 pt-3 pt-md-0">
              {data.is_completed ? (
                <div className={styles.statusComplete}>已完成</div>
              ) : (
                <div className={styles.status}>未完成</div>
              )}
            </div>
            <div className={`d-flex col-6 col-md-4 ${styles.controlContainer}`}>
              <FaRegEdit
                className={styles.controlIcon}
                title="編輯"
                onClick={() => {
                  handleEdit(data.id);
                }}
              />
              <RiDeleteBinLine
                className={styles.controlIcon}
                title="刪除"
                onClick={() => {
                  handleDelete(data.id);
                }}
              />
              <IoIosMore className={styles.controlIcon} title="更多設定" />
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default TaskCard;
