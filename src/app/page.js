"use client";
import styles from "./page.module.css";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { IoEyeSharp, IoEyeOff, IoClose } from "react-icons/io5";
import TaskCard from "@components/TaskCard";
import Pagination from "@components/Pagination";
import ModalTask from "@components/ModalTask";
import { useEffect, useState, useRef } from "react";
import { useTask } from "@/app/context/TaskContext";

export default function Home() {
  const { allDatas, setAllDatas } = useTask();
  const [modalShow, setModalShow] = useState(false);
  // 儲存篩選過的任務清單
  const [datas, setDatas] = useState([]);
  const [hideComplete, setHideComplete] = useState(false);
  // 設置編輯模式
  const [taskToEdit, setTaskToEdit] = useState(null);
  // 當前頁碼
  const [currentPage, setCurrentPage] = useState(1);
  //   計算每一頁的開始索引及結束索引
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 10;
  // 總頁數
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  // 搜尋
  const [query, setQuery] = useState("");
  const [queryDatas, setQueryDatas] = useState([]);
  const [searchStatus, setSearchStatus] = useState(false);
  const listRef = useRef(null);

  const getDatas = async (page = 1) => {
    try {
      const initUrl = "https://wayi.league-funny.com/api/task?page=1";
      const initResponse = await fetch(initUrl);
      const initResult = await initResponse.json();
      const total = initResult.total;
      // 計算總頁數
      const totalPages = Math.ceil(total / itemsPerPage);
      let allData = initResult.data;
      for (let page = 2; page <= totalPages; page++) {
        const url = `https://wayi.league-funny.com/api/task?page=${page}`;
        const response = await fetch(url);
        const result = await response.json();
        allData = [...allData, ...result.data];
      }
      allData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setDatas(allData);
      setAllDatas(allData);
      setPageCount(totalPages);
      setCurrentItems(allData.slice(itemOffset, itemsPerPage));

      // 清除搜尋狀態
      setQuery("");
      setQueryDatas([]);
      setSearchStatus(false);
    } catch (error) {
      console.error("取得任務資料錯誤", error);
    }
  };

  const getSearchResult = () => {
    if (query === "") {
      return;
    }
    const filterDatas =
      query !== ""
        ? allDatas.filter(
            (data) =>
              data.name.includes(query) || data.description.includes(query)
          )
        : allDatas;
    setQueryDatas(filterDatas);
    setSearchStatus(true);
  };

  // 清除搜尋結果
  const handleClear = () => {
    setSearchStatus(false);
    setQuery("");
    setQueryDatas([]);
  };

  //   用戶點下一頁
  const handlePageClick = (e) => {
    const newOffset = e.selected * itemsPerPage;
    setItemOffset(newOffset);
    const page = e.selected + 1;
    setCurrentPage(page);
    setCurrentItems(datas.slice(newOffset, newOffset + itemsPerPage));

    if (listRef.current) {
      window.scrollTo({
        top: listRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleHideComplete = () => {
    const filterDatas = hideComplete
      ? allDatas
      : allDatas.filter((data) => !data.is_completed);
    const endOffest = itemOffset + itemsPerPage;
    setDatas(filterDatas);
    setCurrentItems(filterDatas.slice(itemOffset, endOffest));
    setPageCount(Math.ceil(filterDatas.length / itemsPerPage));
    setHideComplete(!hideComplete);
  };

  const handleIsCompleteChange = async (id, newStatus) => {
    try {
      const url = `https://wayi.league-funny.com/api/task/${id}`;
      const now = new Date().toISOString();
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ is_completed: newStatus, updated_at: now }),
      });

      if (!response.ok) {
        throw new Error("更新任務狀態回應錯誤");
      }

      const updatedAllDatas = allDatas.map((data) =>
        data.id === id
          ? { ...data, is_completed: newStatus, updated_at: now }
          : data
      );
      setAllDatas(updatedAllDatas);

      if (hideComplete) {
        setDatas(updatedAllDatas.filter((data) => !data.is_completed));
      } else {
        setDatas(updatedAllDatas);
      }

      if (queryDatas) {
        const updatedQueryDatas = queryDatas.map((data) =>
          data.id === id
            ? { ...data, is_completed: newStatus, updated_at: now }
            : data
        );
        setQueryDatas(updatedQueryDatas);
      }
    } catch (error) {
      console.error("更新任務狀態錯誤", error);
    }
  };

  const refreshDatas = () => {
    getDatas();
  };

  useEffect(() => {
    getDatas();
  }, []);

  useEffect(() => {
    setCurrentItems(datas.slice(itemOffset, itemOffset + itemsPerPage));
  }, [datas, itemOffset]);

  return (
    <>
      <div className="container" ref={listRef}>
        <div
          className={`${styles.topContainer} d-flex justify-content-between flex-wrap`}
        >
          <div className={`fw-bold ${styles.mainTitle}`}>My Tasks</div>
          <div className={`d-flex ${styles.mainControl}`}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={`form-control rounded-pill bg-dark text-white ${styles.searchInput}`}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <IoClose
                className={`${styles.clearIcon} ${
                  query !== "" ? "" : styles.disabled
                }`}
                onClick={() => {
                  handleClear();
                }}
              />
              <CiSearch
                className={`${styles.searchIcon} ${
                  query !== "" ? "" : styles.disabled
                }`}
                onClick={() => {
                  getSearchResult();
                }}
              />
            </div>
            <div
              className={`btn btn-warning d-inline-flex align-items-center rounded-pill ${styles.myBtn}`}
              onClick={() => {
                setModalShow(true);
                // 清除編輯任務
                setTaskToEdit(null);
              }}
            >
              <FaPlus className="me-2" />
              New Task
            </div>
          </div>
        </div>
        <div className="mt-4">
          {!searchStatus && (
            <div className="d-flex my-4">
              {!hideComplete && (
                <div
                  className={`btn btn-warning  me-2 ${styles.myBtn}`}
                  onClick={() => {
                    setHideComplete(true);
                    handleHideComplete();
                  }}
                >
                  <IoEyeOff className="me-2" />
                  隱藏已完成的任務
                </div>
              )}
              {hideComplete && (
                <div
                  className={`btn btn-warning  me-2 ${styles.showBtn}`}
                  onClick={() => {
                    setHideComplete(false);
                    handleHideComplete();
                  }}
                >
                  <IoEyeSharp className="me-2" />
                  顯示已完成的任務
                </div>
              )}
            </div>
          )}
          <div className={styles.todolistContainer}>
            {searchStatus && queryDatas.length === 0 ? (
              <div className={styles.noResults}>沒有符合的關鍵字詞</div>
            ) : (
              <TaskCard
                datas={queryDatas.length > 0 ? queryDatas : currentItems}
                handleIsCompleteChange={handleIsCompleteChange}
                setTaskToEdit={setTaskToEdit}
                setModalShow={setModalShow}
                itemsPerPage={itemsPerPage}
                refreshDatas={refreshDatas}
                queryDatas={queryDatas}
              />
            )}
          </div>
          <div>
            <ModalTask
              show={modalShow}
              onHide={() => setModalShow(false)}
              refreshDatas={refreshDatas}
              taskToEdit={taskToEdit}
              setAllDatas={setAllDatas}
              setSearchStatus={setSearchStatus}
              setQuery={setQuery}
              setQueryDatas={setQueryDatas}
            />
          </div>
          {queryDatas.length === 0 && !searchStatus && (
            <Pagination
              pageCount={pageCount}
              onPageChange={handlePageClick}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
