'use client'
import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ItemPaginationProps {
    totalItems: number,
    itemsPerPage: number,
    currentPage: number,
    setCurrentPage: (page: number) => void,
}


const ItemPagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
  }: ItemPaginationProps) => {

    

    const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 5; // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

  let activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
  );
   
  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

    // Function to render page numbers with ellipsis
  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={currentPage === page ? "bg-blue-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-md hover:cursor-default" : "hover:cursor-default"}
      >
        <PaginationLink onClick={() => setCurrentPage(page)} className='hover:bg-blue-50 dark:hover:bg-slate-900'>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
        className="bg-blue-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-md hover:cursor-default"
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />
      );
    }

    // Add ellipsis at the end if necessary
    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
        className="bg-blue-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-md hover:cursor-default"
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />
      );
    }

    return renderedPages;
    };
    

    return (
        <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem className='hover:cursor-default hover:bg-blue-50 dark:hover:bg-slate-900 rounded-md'>
              <PaginationPrevious onClick={handlePrevPage} className='hover:bg-blue-50 dark:hover:bg-slate-900'/>
            </PaginationItem>
  
            {renderPages()}
  
            <PaginationItem className='hover:cursor-default hover:bg-blue-50 dark:hover:bg-slate-900 rounded-md'>
              <PaginationNext onClick={handleNextPage} className='hover:bg-blue-50 dark:hover:bg-slate-900'/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
};

export default ItemPagination;