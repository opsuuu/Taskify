"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { CiCalendar, CiBoxList } from "react-icons/ci";
import { format } from "date-fns";
import { useTask } from "@/app/context/TaskContext";

const Header = () => {
  const { allDatas } = useTask();
  const date = format(new Date(), "EEE, MMM d");
  // 未完成任務總數
  const totalTask = allDatas.filter(data => !data.is_completed).length;

  return (
    <>
      <nav className="navbar bg-dark text-white fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand text-white ms-3" href="#">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block  me-2"
            />
            Taskify
          </Link>
          <div className="me-3 d-none d-lg-flex d-md-flex d-sm-none">
            <div className="d-flex align-items-center me-3">
              <CiCalendar className={`me-2 ${styles.icon}`} />
              {date}
            </div>
            <div className="d-flex align-items-center me-3">
              <CiBoxList className="me-2" />
              {totalTask} 個未完成任務
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
