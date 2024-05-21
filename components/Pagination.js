"use client";
import ReactPaginate from "react-paginate";

const Pagination = ({ onPageChange, pageCount, currentPage }) => {
  return (
    <ReactPaginate
      breakLabel="· · ·"
      nextLabel="&#10095;"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="&#10094;"
      renderOnZeroPageCount={null}
      containerClassName="pagination"
      pageLinkClassName="page-num"
      previousLinkClassName={`page-num ${currentPage === 1 ? "disable" : ""}`}
      nextLinkClassName={`page-num ${
        currentPage === pageCount ? "disable" : ""
      }`}
      activeLinkClassName="page-active"
      breakClassName="page-break"
    />
  );
};

export default Pagination;
